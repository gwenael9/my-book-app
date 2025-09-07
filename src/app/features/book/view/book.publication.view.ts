import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@/features/auth/services/auth.service';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-publication',
  imports: [CommonModule, BookCardComponent, ButtonModule, RouterLink],
  standalone: true,
  template: `
    <div class="flex justify-between">
      <h2 class="text-primary font-semibold text-xl">Mes publications ({{ books().length }})</h2>
      <p-button routerLink="/books/add" label="Ajouter un livre" icon="pi pi-plus"></p-button>
    </div>
    <div class="flex justify-center mt-5">
      <div class="flex flex-wrap gap-4">
        @for (book of books(); track trackByBookId(book)) {
          <app-book-card [book]="book"></app-book-card>
        }
      </div>
    </div>
  `,
})
export class BookPublicationComponent {
  bookService = inject(BookService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  books = signal<Book[]>([]);

  constructor() {
    const user = this.authService.currentUser$();
    const userId = user?.id ?? 1;
    this.bookService.getBookByUser(userId).then((data) => this.books.set(data));
  }

  trackByBookId(book: Book): number {
    return book.id;
  }
}
