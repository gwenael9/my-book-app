import { User } from '@/auth/models/user.model';
import { AuthService } from '@/auth/services/auth.service';
import { GenericTableComponent } from '@/shared/components/ui/table.component';
import { HighlightDirective } from '@/shared/directives/highlight.directive';
import { RolesPipe } from '@/shared/pipes/roles.pipe';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

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
          <p-button text severity="danger" icon="pi pi-trash" (click)="deleteUser(user.id)" />
        </div>
      </td>
    </ng-template>
  `,
})
export class AdminUsersTableComponent {
  @Input() users: User[] = [];
  cols: string[] = ['ID', 'Nom', 'Email', 'Role', 'Action'];

  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  deleteUser(userId: number) {
    // TODO:Ajouter une modal de confirmation
    this.authService.deleteUser(userId).subscribe();
  }
}
