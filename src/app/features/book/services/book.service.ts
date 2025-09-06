import { computed, Injectable, signal } from '@angular/core';
import { mockBooks } from '@/app/mock-data';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books = signal<Book[]>(mockBooks);

  public getAllBooks = computed(() => this.books());

  public getBooksAvailable = computed(() => this.books().filter((book) => book.available === true));
}
