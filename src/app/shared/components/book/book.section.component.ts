import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-book-section',
  standalone: true,
  imports: [CommonModule, Button, RouterModule],
  template: `
    <h2 class="text-primary font-semibold text-xl">{{ title }}</h2>

    <div class="flex justify-center mt-5">
      @if (empty) {
        <div class="flex flex-col items-center gap-4">
          <p class="text-center text-gray-500">{{ emptyMessage }}</p>
          <p-button
            [routerLink]="emptyActionLink"
            [label]="emptyActionLabel"
            [icon]="emptyActionIcon"
          ></p-button>
        </div>
      } @else {
        <ng-content></ng-content>
      }
    </div>
  `,
})
export class BookSectionComponent {
  @Input() title!: string;

  @Input() empty = false;
  @Input() emptyMessage = 'Aucun élément.';

  @Input() emptyActionLabel?: string;
  @Input() emptyActionLink!: string;
  @Input() emptyActionIcon = 'pi pi-book';
}
