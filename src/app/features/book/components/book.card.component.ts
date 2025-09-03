import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      role="button"
      tabindex="0"
      class="relative border border-primary p-2 rounded-lg min-w-52 overflow-hidden"
      (click)="openModal()"
    >
      @if (book.available) {
        <span class="absolute bg-green-500 w-12 h-2 rotate-45 right-[-12px]"></span>
      }
      <h3 class="text-primary font-semibold">{{ book.title }}</h3>
      <p class="text-sm text-gray-500 font-mono">{{ book.author }}</p>
      <div class="mt-2 flex justify-end">
        <div class="border px-2 rounded-xl text-xs">{{ book.status }}</div>
      </div>
    </div>

    @if (isModalOpen) {
      <div
        class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        (click)="closeModal()"
        role="button"
        tabindex="0"
      >
        <div
          class="bg-white p-6 rounded-lg max-w-sm w-full relative border border-gray-300"
          (click)="$event.stopPropagation()"
          role="button"
          tabindex="0"
        >
          <h2 class="text-primary font-semibold text-lg">{{ book.title }}</h2>
          <p class="text-xs font-semibold text-gray-500">In progress...</p>
          <div class="flex justify-end">
            <button class="mt-4 px-4 py-2 text-red-500 bg-white rounded" (click)="closeModal()">
              <lucide-icon name="x"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    }
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
}
