import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookCardComponent],
  standalone: true,
  template: `
    <h2 class="text-primary font-semibold text-xl">
      Tout les livres ({{ booksToDisplay.length }})
    </h2>
    <label class="inline-flex items-center gap-2 mt-2">
      <input type="checkbox" (change)="showAvailableOnly = $event.target.checked" />
      Afficher seulement les livres disponibles
    </label>
    <div class="flex justify-center mt-5">
      <div class="flex flex-col flex-wrap sm:flex-row gap-8 sm:gap-4 overflow-hidden">
        @for (book of booksToDisplay; track trackByBookId(book)) {
          <app-book-card [book]="book"></app-book-card>
        }
      </div>
    </div>
  `,
})
export class BookListComponent {
  bookService = inject(BookService);
  showAvailableOnly = false;

  get booksToDisplay() {
    return this.showAvailableOnly
      ? this.bookService.getBooksAvailable()
      : this.bookService.getAllBooks();
  }

  trackByBookId(book: Book): number {
    return book.id;
  }
}
