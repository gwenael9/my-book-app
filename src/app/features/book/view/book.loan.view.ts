import { AuthService } from '@/features/auth/services/auth.service';
import { BookSectionComponent } from '@/shared/components/book/book.section.component';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-loan',
  imports: [CommonModule, BookCardComponent, BookSectionComponent],
  standalone: true,
  template: `
    <app-book-section
      title="Mes emprunts"
      [empty]="books.length === 0"
      emptyMessage="Vous n'avez pas encore emprunté de livre."
      emptyActionLabel="Voir les livres"
      emptyActionLink="/books"
    >
      <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        @for (book of books; track trackByBookId(book)) {
          <app-book-card [book]="book" [withTag]="false"></app-book-card>
        }
      </div>
    </app-book-section>
  `,
})
export class BookLoanComponent {
  bookService = inject(BookService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  books = this.bookService.getBookLoanByUser(this.currentUser()?.id);

  trackByBookId = (book: Book) => book.id;
}
