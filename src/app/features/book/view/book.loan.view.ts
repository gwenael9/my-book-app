import { AuthService } from '@/features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-loan',
  imports: [CommonModule, BookCardComponent, Button, RouterLink],
  standalone: true,
  template: `
    <h2 class="text-primary font-semibold text-xl">Mes emprunts</h2>
    <div class="flex justify-center mt-5">
      @if (books.length === 0) {
        <div class="flex flex-col items-center gap-4">
          <p class="text-center text-gray-500">Vous n'avez pas encore emprunté de livre.</p>
          <p-button routerLink="/books" label="Voir les livres" icon="pi pi-book"></p-button>
        </div>
      } @else {
        <div class="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-4">
          @for (book of books; track trackByBookId(book)) {
            <app-book-card [book]="book" [withTag]="false"></app-book-card>
          }
        </div>
      }
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
