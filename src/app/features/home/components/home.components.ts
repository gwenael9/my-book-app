import { AuthService } from '@/auth/services/auth.service';
import { BookService } from '@/book/services/book.service';
import { AuthModalComponent } from '@/features/auth/components/auth.modal.component';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, Button, RouterLink, AuthModalComponent],
  template: `
    <div class="px-6 pb-8 max-w-7xl mx-auto">
      <section class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-primary mb-2">Bienvenue sur My-Book-App</h1>
        <p class="text-gray-500 sm:text-lg">
          Explorez et empruntez vos livres préférés facilement.
        </p>
        <div class="mt-4 flex justify-center gap-4">
          <p-button routerLink="/books" label="Parcourir les livres" outlined />
          @if (currentUser()) {
            <p-button routerLink="/books/add" label="Ajouter un livre" />
          } @else {
            <p-button label="Me connecter" (click)="isModalOpen = true" />
          }
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-primary mb-4">Nos derniers livres</h2>
        <p-carousel
          class="max-w-[600px] mx-auto"
          [value]="books"
          [numVisible]="1"
          [numScroll]="1"
          [circular]="true"
          [showIndicators]="true"
        >
          <ng-template let-book #item>
            <div class="mx-2 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="/books/{{ book.image }}.jpg"
                alt="{{ book.title }}"
                class="object-cover w-full h-72 sm:h-80"
              />
            </div>
          </ng-template>
        </p-carousel>
      </section>

      <app-auth-modal
        [visible]="isModalOpen"
        (visibleChange)="isModalOpen = $event"
      ></app-auth-modal>
    </div>
  `,
})
export class HomeComponent {
  private bookService = inject(BookService);
  private authService = inject(AuthService);

  isModalOpen = false;

  books = this.bookService.getAllBooks();
  currentUser = this.authService.currentUser$;
}
