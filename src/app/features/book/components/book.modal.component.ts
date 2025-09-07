import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../auth/services/auth.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  template: `
    <p-dialog
      [modal]="true"
      [(visible)]="visible"
      (visibleChange)="onVisibleChange($event)"
      [style]="{ width: '25rem' }"
    >
      <ng-template pTemplate="header">
        <h2 class="text-primary font-semibold text-lg mb-2">
          {{ book.title }}
          <span class="text-sm italic text-gray-500">({{ book.author }})</span>
        </h2>
      </ng-template>
      @if (book.available === false) {
        <p class="p-text-secondary block mb-8">
          Disponible à partir du {{ book.availableAt.toLocaleDateString() }}
        </p>
      }
      @if (book.available && book.ownerId !== currentUser()?.id) {
        <div class="flex justify-end gap-2">
          <p-button label="Emprunter" (click)="close()" />
        </div>
      }
    </p-dialog>
  `,
})
export class BookModalComponent {
  @Input() book!: Book;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
  }
}
