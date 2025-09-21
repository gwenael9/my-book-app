import { AuthService } from '@/auth/services/auth.service';
import { Book } from '@/book/models/book.model';
import { BookService } from '@/book/services/book.service';
import { GenericTableComponent } from '@/shared/components/ui/table.component';
import { StatusPipe } from '@/shared/pipes/status.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-admin-books-table',
  standalone: true,
  imports: [TableModule, Button, TagModule, StatusPipe, CommonModule, GenericTableComponent],
  template: `
    <app-generic-table
      [columns]="cols"
      [data]="books"
      [rowTemplate]="bookRowTpl"
    ></app-generic-table>

    <ng-template #bookRowTpl let-book>
      <td style="text-align:center">{{ book.id }}</td>
      <td style="text-align:center">{{ book.title }}</td>
      <td style="text-align:center">{{ book.author }}</td>
      <td style="text-align:center">
        <p-tag
          [value]="(book.status | status).label"
          [severity]="(book.status | status).severity"
          [rounded]="true"
        />
      </td>
      <td style="text-align:center">{{ getUserName(book.ownerId) }}</td>
      <td style="text-align:center">{{ book.userId ? getUserName(book.userId) : '-' }}</td>
      <td style="text-align:center">
        {{ book.status === 'free' ? "Aujourd'hui" : (book.availableAt | date: 'dd/MM/yy') }}
      </td>
      <td style="text-align:center">{{ book.createdAt | date: 'dd/MM/yy, HH:mm' }}</td>
      <td>
        <div class="flex justify-center">
          <p-button text icon="pi pi-eye" (click)="goToDetail(book.id)" />
          <!-- TODO:Modifier le livre directement dans la table (primeng) -->
          <p-button text icon="pi pi-pencil" />
          <p-button text severity="danger" icon="pi pi-trash" (click)="deleteBook(book.id)" />
        </div>
      </td>
    </ng-template>
  `,
})
export class AdminBooksTableComponent {
  @Input() books: Book[] = [];
  cols: string[] = [
    'ID',
    'Titre',
    'Auteur',
    'Status',
    'Propriétaire',
    'Emprunteur',
    'Disponibilité',
    'Date de création',
    'Action',
  ];
  private router = inject(Router);
  private bookService = inject(BookService);
  private authService = inject(AuthService);

  getUserName(id: number) {
    return this.authService.getUserNameById(id);
  }

  goToDetail(bookId: number) {
    this.router.navigate(['/books', bookId]);
  }

  deleteBook(bookId: number) {
    this.bookService.deleteBook(bookId).subscribe();
  }
}
