import { computed, inject, Injectable, signal } from '@angular/core';
import { mockBooks } from '@/app/mock-data';
import { AuthService } from '@/features/auth/services/auth.service';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books = signal<Book[]>(mockBooks);
  private authService = inject(AuthService);

  public getAllBooks = computed(() => this.books());

  public getBooksAvailable = computed(() => this.books().filter((book) => book.available === true));

  async getBookByUser(userId: number): Promise<Book[]> {
    await this.delay(200);
    return this.getAllBooks().filter((book) => book.ownerId === userId);
  }

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
