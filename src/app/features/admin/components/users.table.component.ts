import { User } from '@/auth/models/user.model';
import { AuthService } from '@/auth/services/auth.service';
import { BookService } from '@/book/services/book.service';
import { GenericTableComponent } from '@/shared/components/admin/table.component';
import { ConfirmModalComponent } from '@/shared/components/confirm.modal.component';
import { HighlightDirective } from '@/shared/directives/highlight.directive';
import { RolesPipe } from '@/shared/pipes/roles.pipe';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-users-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    RolesPipe,
    GenericTableComponent,
    CommonModule,
    HighlightDirective,
    ConfirmModalComponent,
  ],
  template: `
    <app-generic-table
      [columns]="cols"
      [data]="users"
      [rowTemplate]="userRowTpl"
    ></app-generic-table>
    <ng-template #userRowTpl let-user>
      <td style="text-align:center">{{ user.id }}</td>
      <td style="text-align:center">
        <div
          [appHighlight]="user.id === currentUser()?.id ? 'rgba(100, 268, 68, 0.1)' : 'transparent'"
          class="rounded-md"
        >
          {{ user.name }}
        </div>
      </td>
      <td style="text-align:center">{{ user.email }}</td>
      <td style="text-align:center">{{ user.role | roles }}</td>
      <td>
        <div class="flex justify-center">
          <p-button text severity="danger" icon="pi pi-trash" (click)="confirmDelete(user)" />
        </div>
      </td>
    </ng-template>

    <app-confirm-modal
      [visible]="isConfirmModalOpen"
      title="Supprimer l'utilisateur ?"
      [name]="userToDelete?.name"
      (confirmed)="deleteUser()"
      (visibleChange)="isConfirmModalOpen = $event"
    ></app-confirm-modal>
  `,
})
export class AdminUsersTableComponent {
  @Input() users: User[] = [];
  cols: string[] = ['ID', 'Nom', 'Email', 'Role', 'Action'];

  private authService = inject(AuthService);
  private bookService = inject(BookService);
  currentUser = this.authService.currentUser$;

  isConfirmModalOpen = false;
  userToDelete: User | null = null;

  confirmDelete(user: User) {
    this.userToDelete = user;
    this.isConfirmModalOpen = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;
    const userId = this.userToDelete.id;
    this.authService
      .deleteUser(userId)
      .pipe(switchMap(() => this.bookService.deleteAllBooksFromUserId(userId)))
      .subscribe();
    this.userToDelete = null;
  }
}
