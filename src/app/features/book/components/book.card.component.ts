import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Book } from '../models/book.model';
import { BookModalComponent } from './book.modal.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    BookModalComponent,
    SkeletonModule,
    TagModule,
  ],
  template: `
    <div
      class="relative w-full h-80 mb-2 overflow-hidden rounded-lg group"
      role="button"
      tabindex="0"
      (click)="openModal()"
    >
      @if (!imageLoaded()) {
        <p-skeleton width="100%" height="100%" class="absolute inset-0"></p-skeleton>
      }

      <img
        (load)="onImageLoad()"
        src="/books/{{ book.image }}.jpg"
        alt="Book cover"
        class="w-full h-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
      />

      <div
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      ></div>

      <p-tag
        class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        [value]="book.status"
        severity="success"
        [rounded]="true"
      />

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
  imageLoaded = signal(false);

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getBook() {
    // faire une demande d'emprunt à l'ownerId si reel api (websocket)
    // dans notre cas, emprunter directement avec une date de fin d'emprunt indiqué
  }

  onImageLoad() {
    setTimeout(() => this.imageLoaded.set(true), 1000);
  }
}
