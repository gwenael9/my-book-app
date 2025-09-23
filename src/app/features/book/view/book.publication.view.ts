import { AuthService } from '@/features/auth/services/auth.service';
import { BookSectionComponent } from '@/shared/components/book/book.section.component';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../components/book.card.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-publication',
  imports: [CommonModule, BookCardComponent, BookSectionComponent],
  standalone: true,
  template: `
    <app-book-section
      title="Mes publications ({{ books.length }})"
      [empty]="books.length === 0"
      emptyMessage="Vous n'avez pas encore publié de livre."
      emptyActionLabel="Ajouter un livre"
      emptyActionLink="/books/add"
      emptyActionIcon="pi pi-plus"
    >
      <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        @for (book of books; track trackByBookId(book)) {
          <app-book-card [book]="book" [withTag]="false"></app-book-card>
        }</div
    ></app-book-section>
  `,
})
export class BookPublicationComponent {
  bookService = inject(BookService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  books = this.bookService.getBookByUser(this.currentUser()?.id);

  trackByBookId = (book: Book) => book.id;
}
