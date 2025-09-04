import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BookModalComponent } from './book.modal.component';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, BookModalComponent],
  template: `
    <div
      class="relative w-full h-40 md:h-80 mb-2 overflow-hidden rounded-lg group"
      role="button"
      tabindex="0"
      (click)="openModal()"
    >
      <img
        [src]="getBookImage()"
        alt="Book cover"
        class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      />

      <div
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      ></div>

      <div
        class="absolute right-2 top-2 border px-2 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-white text-gray-800"
      >
        {{ book.status }}
      </div>

      <div
        class="absolute bottom-0 left-0 w-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <h3 class="font-semibold text-sm md:text-base">{{ book.title }}</h3>
        <p class="text-xs md:text-sm font-mono">{{ book.author }}</p>
      </div>
    </div>

    <app-book-modal
      [book]="book"
      [visible]="isModalOpen"
      (visibleChange)="closeModal()"
    ></app-book-modal>
  `,
})
export class BookCardComponent {
  @Input() book!: Book;
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // 4 le nombre d'image dispo
  imageId = Math.floor(Math.random() * 4) + 1;

  getBookImage(): string {
    return `/books/${this.imageId}.jpg`;
  }

  getBook() {
    // faire une demande d'emprunt à l'ownerId si reel api (websocket)
    // dans notre cas, emprunter directement avec une date de fin d'emprunt indiqué
  }
}
