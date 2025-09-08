import { AuthService } from '@/features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-loan',
  imports: [CommonModule, BookCardComponent],
  standalone: true,
  template: `
    <h2 class="text-primary font-semibold text-xl">Mes emprunts</h2>
    <div class="flex justify-center mt-5">
      <div class="flex flex-wrap gap-4">
        @for (book of books; track trackByBookId(book)) {
          <app-book-card [book]="book"></app-book-card>
        }
      </div>
    </div>
  `,
})
export class BookLoanComponent {
  bookService = inject(BookService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  books = this.bookService.getBookLoanByUser(this.currentUser()?.id);

  trackByBookId(book: Book): number {
    return book.id;
  }
}
