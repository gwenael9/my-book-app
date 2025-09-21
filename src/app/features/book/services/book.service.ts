import { mockBooks } from '@/app/mock-data';
import { AuthService } from '@/features/auth/services/auth.service';
import { computed, inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { delay, Observable, of, throwError } from 'rxjs';
import { Book, CreateBook } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private defaultBooks: Book[] = mockBooks;

  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  private books: Book[] = [];

  constructor() {
    this.loadBooksFromLocalStorage();
  }

  public getAllBooks = computed(() => this.books);
  public getBooksAvailable = computed(() => this.books.filter((book) => book.available));

  getBookByUser(userId?: number): Book[] {
    this.delay(200);
    return this.books
      .filter((book) => book.ownerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getBookLoanByUser(userId?: number): Book[] {
    this.delay(200);
    return this.books
      .filter((book) => book.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addBook(book: CreateBook): Observable<Book> {
    const currentUser = this.authService.currentUser$;
    const userId = currentUser()?.id;
    if (!userId) return throwError(() => new Error("Vous n'êtes pas connecté."));

    const existingBook = this.getBookByUser(userId).find(
      (b) => b.title.toLowerCase() === book.title.toLowerCase(),
    );

    if (existingBook) return throwError(() => new Error('Vous avez déjà posté ce livre.'));

    const maxId = this.books.reduce((max, b) => (b.id > max ? b.id : max), 0);

    const newBook: Book = {
      id: maxId + 1,
      title: book.title,
      author: book.author,
      status: 'free',
      description: book.description,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      availableAt: new Date(),
      available: true,
      image: book.image,
    };

    this.books.push(newBook);
    this.saveBookToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Livre ajouté avec succès',
      detail: `Le livre ${newBook.title} a bien été ajouté !`,
      life: 3000,
    });

    return of(newBook).pipe(delay(500));
  }

  loanBook(bookId: number, newDate: Date): Observable<Book> {
    const currentUser = this.authService.currentUser$;
    const userId = currentUser()?.id;
    if (!userId) return throwError(() => new Error("Vous n'êtes pas connecté."));

    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) return throwError(() => new Error("Ce livre n'est pas disponible."));

    // ajouter une verif sur la date

    const updatedBook: Book = {
      ...this.books[bookIndex],
      userId,
      availableAt: newDate,
      available: false,
      status: 'unavailable',
    };
    this.books[bookIndex] = updatedBook;

    this.saveBookToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Livre emprunté avec succès',
      detail: `Merci ! Le livre ${updatedBook.title} a bien été emprunté !`,
      life: 3000,
    });

    return of(updatedBook).pipe(delay(100));
  }

  returnBook(bookId: number): Observable<Book> {
    const currentUser = this.authService.currentUser$;
    const userId = currentUser()?.id;
    if (!userId) return throwError(() => new Error("Vous n'êtes pas connecté."));

    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) return throwError(() => new Error('Livre introuvable.'));

    const book = this.books[bookIndex];
    if (book.userId !== userId) {
      return throwError(() => new Error("Vous n'avez pas emprunté ce livre."));
    }

    const updatedBook: Book = {
      ...book,
      userId: undefined,
      availableAt: new Date(),
      available: true,
      status: 'free',
    };
    this.books[bookIndex] = updatedBook;

    this.saveBookToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Emprunt terminé',
      detail: `Le livre ${updatedBook.title} a été rendu.`,
      life: 3000,
    });

    return of(updatedBook).pipe(delay(100));
  }

  deleteBook(bookId: number): Observable<void> {
    const currentUser = this.authService.currentUser$;
    const user = currentUser();
    if (!user) return throwError(() => new Error("Vous n'êtes pas connecté."));

    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) return throwError(() => new Error('Livre introuvable.'));

    const book = this.books[bookIndex];
    if (book.ownerId !== user.id && user.role === 'user') {
      return throwError(() => new Error("Vous n'êtes pas autorisé à supprimer ce livre."));
    }

    this.books.splice(bookIndex, 1);
    this.saveBookToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Livre supprimé',
      detail: `Le livre ${book.title} a été supprimé.`,
      life: 3000,
    });

    return of(void 0).pipe(delay(100));
  }

  updateBook(bookId: number, updatedData: Partial<Book>): Observable<Book> {
    const currentUser = this.authService.currentUser$;
    const user = currentUser();
    if (!user) return throwError(() => new Error("Vous n'êtes pas connecté."));

    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) return throwError(() => new Error('Livre introuvable.'));

    const book = this.books[bookIndex];
    if (book.ownerId !== user.id) {
      return throwError(() => new Error("Vous n'êtes pas autorisé à modifier ce livre."));
    }

    const updatedBook: Book = {
      ...book,
      ...updatedData,
      updatedAt: new Date(),
    };

    this.books[bookIndex] = updatedBook;
    this.saveBookToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Livre modifié',
      detail: `Le livre ${updatedBook.title} a été mis à jour.`,
      life: 3000,
    });

    return of(updatedBook).pipe(delay(100));
  }

  getBookById(id: number): Book {
    const book = this.books.find((b) => b.id === id);
    if (!book) throw new Error('Livre introuvable.');
    return book;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private saveBookToLocalStorage(): void {
    localStorage.setItem('allBooks', JSON.stringify(this.books));
  }

  private loadBooksFromLocalStorage(): void {
    const allBooks = localStorage.getItem('allBooks');

    if (allBooks) {
      const parsed: Book[] = JSON.parse(allBooks);
      this.books = parsed.map((book) => ({
        ...book,
        createdAt: new Date(book.createdAt),
        updatedAt: new Date(book.updatedAt),
        availableAt: new Date(book.availableAt),
      }));
    } else {
      this.books = [...this.defaultBooks];
    }
  }
}
