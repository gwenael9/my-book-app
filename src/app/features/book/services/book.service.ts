import { computed, inject, Injectable, signal } from '@angular/core';
import { mockBooks } from '@/app/mock-data';
import { AuthService } from '@/features/auth/services/auth.service';
import { Book, CreateBook } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books = signal<Book[]>(mockBooks);
  private authService = inject(AuthService);

  public getAllBooks = computed(() => this.books());

  public getBooksAvailable = computed(() => this.books().filter((book) => book.available));

  async getBookByUser(userId: number): Promise<Book[]> {
    await this.delay(200);
    return this.getAllBooks().filter((book) => book.ownerId === userId);
  }

  async addBook(book: CreateBook): Promise<Book> {
    await this.delay(400);

    const currentUser = this.authService.currentUser$;
    const userId = currentUser()?.id;

    if (!userId) throw new Error('Utilisateur non connecté');

    const newBook: Book = {
      id: Date.now(),
      title: book.title,
      description: book.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: book.author,
      status: 'free',
      ownerId: userId,
      availableAt: new Date(),
      available: true,
    };

    this.books.update((books) => [...books, newBook]);
    return newBook;
  }

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
