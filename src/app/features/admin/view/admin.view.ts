import { AuthService } from '@/auth/services/auth.service';
import { BookService } from '@/book/services/book.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Observable } from 'rxjs';
import { Book } from '../../book/models/book.model';
import { AdminBooksTableComponent } from '../components/books.table.component';
import { AdminUsersTableComponent } from '../components/users.table.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TabsModule, AdminBooksTableComponent, AdminUsersTableComponent],
  template: `
    <h2 class="text-primary font-semibold text-xl">Administration</h2>
    <div class="mx-12 mt-4">
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Livres</p-tab>
          <p-tab value="1">Utilisateurs</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <app-admin-books-table [books]="(books$ | async) || []" />
          </p-tabpanel>
          <p-tabpanel value="1">
            <app-admin-users-table [users]="users" />
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class AdminComponent {
  private bookService = inject(BookService);
  private authService = inject(AuthService);

  books$: Observable<Book[]> = this.bookService.getAllBooksLive();
  users = this.authService.getAllUsers();
}
