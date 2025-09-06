import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthModalComponent } from '@/features/auth/components/auth.modal.component';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, AuthModalComponent, MenuModule],
  template: `
    <header class="p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h2 class="text-xl font-bold">
          <a routerLink="/home">Home</a>
        </h2>
        <div class="flex space-x-2">
          <p-button
            routerLink="/books"
            icon="pi pi-book"
            styleClass="p-button-rounded p-button-outlined"
          ></p-button>
          @if (currentUser()) {
            <p-menu #menu [model]="items" [popup]="true"></p-menu>
            <p-button
              (click)="menu.toggle($event)"
              styleClass="p-button-rounded"
              icon="pi pi-user"
            />
          } @else {
            <p-button
              (click)="openModal()"
              icon="pi pi-user"
              styleClass="p-button-rounded p-button-outlined"
            />
            <app-auth-modal
              [visible]="isModalOpen"
              (visibleChange)="isModalOpen = $event"
            ></app-auth-modal>
          }
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  isModalOpen = false;

  currentUser = this.authService.currentUser$;

  items: MenuItem[] = [
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: () => {
        this.closeModal();
        this.authService.logout();
      },
    },
  ];

  constructor() {
    this.currentUser = this.authService.currentUser$;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
