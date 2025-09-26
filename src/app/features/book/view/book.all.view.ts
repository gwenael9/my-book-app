import { BookSectionComponent } from '@/shared/components/book/book.section.component';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookCardComponent, BookSectionComponent],
  standalone: true,
  template: `
    <app-book-section
      title="Tous les livres ({{ books.length }})"
      [empty]="books.length === 0"
      emptyMessage="Aucun livre de disponibles."
      emptyActionLabel="Créer en un"
      emptyActionLink="/books/add"
    >
      <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        @for (book of books; track trackByBookId(book)) {
          <app-book-card [book]="book"></app-book-card>
        }
      </div>
    </app-book-section>
  `,
})
export class BookListComponent {
  bookService = inject(BookService);
  showAvailableOnly = false;

  books = this.bookService.getAllBooks();

  trackByBookId = (book: Book) => book.id;
}
