import { AuthService } from '@/features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-publication',
  imports: [CommonModule, BookCardComponent, ButtonModule, RouterLink],
  standalone: true,
  template: `
    <h2 class="text-primary font-semibold text-xl">Mes publications ({{ books.length }})</h2>
    @if (books.length === 0) {
      <div class="flex flex-col items-center gap-4 mt-5">
        <p class="text-center text-gray-500">Vous n'avez pas encore publié de livre.</p>
        <p-button routerLink="/books/add" label="Ajouter un livre" icon="pi pi-plus"></p-button>
      </div>
    } @else {
      <div class="flex justify-center mt-5">
        <div class="flex flex-wrap gap-4 overflow-hidden">
          @for (book of books; track trackByBookId(book)) {
            <app-book-card [book]="book" [withTag]="false"></app-book-card>
          }
        </div>
      </div>
    }
  `,
})
export class BookPublicationComponent {
  bookService = inject(BookService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  books = this.bookService.getBookByUser(this.currentUser()?.id);

  trackByBookId(book: Book): number {
    return book.id;
  }
}
