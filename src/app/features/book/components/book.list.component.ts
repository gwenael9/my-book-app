import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

import { BookCardComponent } from './book.card.component';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookCardComponent],
  standalone: true,
  template: `
    <h2 class="text-primary font-semibold text-xl">Book List</h2>
    <div class="flex justify-center mt-5">
      <div class="flex space-x-3">
        @for (book of bookService.getAllBooks(); track trackByBookId(book)) {
          <app-book-card [book]="book"></app-book-card>
        }
      </div>
    </div>
  `,
})
export class BookListComponent {
  bookService = inject(BookService);

  trackByBookId(book: Book): number {
    return book.id;
  }
}
