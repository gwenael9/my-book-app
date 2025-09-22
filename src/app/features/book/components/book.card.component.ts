import { StatusPipe } from '@/pipes/status.pipe';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, SkeletonModule, TagModule, StatusPipe],
  template: `
    <div
      class="relative w-full sm:h-80 overflow-hidden rounded-lg group bg-gray-100 flex items-center justify-center"
      role="button"
      tabindex="0"
      (click)="goToDetail()"
    >
      @if (!imageLoaded()) {
        <p-skeleton width="100%" height="100%" class="absolute inset-0"></p-skeleton>
      }
      <img
        (load)="onImageLoad()"
        src="/books/{{ book.image }}.jpg"
        alt="Book cover"
        class="sm:w-full h-[400px] sm:h-full object-cover transition duration-300 ease-in-out sm:group-hover:scale-105"
      />

      <div
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      ></div>

      @if (withTag) {
        <p-tag
          class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          [value]="(book.status | status).label"
          [severity]="(book.status | status).severity"
          [rounded]="true"
        />
      }

      <div
        class="absolute bottom-0 left-0 w-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <h3 class="font-semibold text-sm md:text-base">{{ book.title }}</h3>
        <p class="text-xs md:text-sm font-mono">{{ book.author }}</p>
      </div>
    </div>
  `,
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() withTag = true;
  imageLoaded = signal(false);

  private router = inject(Router);

  goToDetail() {
    this.router.navigate(['/books', this.book.id]);
  }

  onImageLoad() {
    setTimeout(() => this.imageLoaded.set(true), 1000);
  }
}
