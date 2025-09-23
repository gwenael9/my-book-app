import { AuthModalComponent } from '@/features/auth/components/auth.modal.component';
import { AuthService } from '@/features/auth/services/auth.service';
import { capitalizeFirstLetter } from '@/shared/utils/capitalize';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, AuthModalComponent, MenuModule, AvatarModule],
  template: `
    <header class="px-8 py-4">
      <div class="mx-auto flex justify-between items-center">
        <p-button routerLink="/" icon="pi pi-home" rounded outlined size="large"></p-button>
        <div class="flex gap-2">
          <p-button
            routerLink="/books"
            icon="pi pi-book"
            styleClass="p-button-rounded p-button-outlined"
            size="large"
          ></p-button>
          @if (currentUser()) {
            <div>
              <p-menu class="text-sm" #menu [model]="items()" [popup]="true">
                <ng-template #start>
                  <div class="flex flex-col items-center py-2 gap-1">
                    <p-avatar
                      image="https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png"
                      shape="circle"
                      size="xlarge"
                    />
                    <p>
                      <span class="font-bold">{{ getCapitalizedName() }}</span>
                      <span class="text-sm italic text-gray-500 font-semibold">
                        ({{ getUserRole() }})
                      </span>
                    </p>
                  </div>
                </ng-template>
              </p-menu>
              <button (click)="menu.toggle($event)">
                <p-avatar
                  image="https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png"
                  shape="circle"
                  size="large"
                />
              </button>
            </div>
          } @else {
            <p-button (click)="openModal()" icon="pi pi-user" rounded outlined size="large" />
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
  private router = inject(Router);

  isModalOpen = false;
  currentUser = this.authService.currentUser$;

  items = computed<MenuItem[]>(() => {
    const user = this.currentUser();
    return [
      { separator: true },
      { label: 'Mes publications', icon: PrimeIcons.BOOK, routerLink: '/books/publication' },
      { label: 'Mes emprunts', icon: PrimeIcons.SHOPPING_CART, routerLink: '/books/loan' },
      { label: 'Ajouter un livre', icon: PrimeIcons.PLUS, routerLink: '/books/add' },
      {
        label: 'Administration',
        icon: PrimeIcons.COG,
        routerLink: '/admin',
        visible: user?.role === 'admin',
      },
      { separator: true },
      { label: 'Déconnexion', icon: PrimeIcons.SIGN_OUT, command: () => this.logout() },
    ];
  });

  constructor() {
    this.currentUser = this.authService.currentUser$;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  logout() {
    this.closeModal();
    this.router.navigate(['/']);
    this.authService.logout();
  }

  getCapitalizedName(): string {
    const user = this.currentUser?.();
    return user ? capitalizeFirstLetter(user.name) : '';
  }

  getUserRole(): string {
    const user = this.currentUser?.();
    return user ? user.role.toUpperCase() : '';
  }
}
