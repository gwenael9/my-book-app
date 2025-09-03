import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div
      (click)="close()"
      role="button"
      tabindex="0"
      class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        (click)="$event.stopPropagation()"
        role="button"
        tabindex="0"
        class="bg-white p-4 rounded-lg max-w-sm w-full relative border border-gray-300"
      >
        <h2 class="text-primary font-semibold text-lg mb-2">
          {{ book.title }}
          <span class="text-xs italic text-gray-500">({{ book.author }})</span>
        </h2>
        <p class="text-xs font-semibold text-gray-500 italic">
          Disponible à partir du {{ book.availableAt.toLocaleDateString() }}
        </p>
        <div>
          <p>{{ book.description }}</p>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button class="bg-white rounded" (click)="getBook()">
            <lucide-icon size="18" name="shopping-bag"></lucide-icon>
          </button>
          <button class="text-red-500 bg-white rounded" (click)="close()">
            <lucide-icon size="18" name="x"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BookModalComponent {
  @Input() book!: Book;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  getBook() {
    // faire une demande d'emprunt à l'ownerId si reel api (websocket)
    // dans notre cas, emprunter directement avec une date de fin d'emprunt indiqué
  }
}
