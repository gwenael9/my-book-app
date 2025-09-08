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

    const newBook: Book = {
      id: this.books.length + 1,
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

  // Simuler un délai réseau
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
