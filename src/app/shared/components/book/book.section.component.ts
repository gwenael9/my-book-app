import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EmptyObjectComponent } from '../empty.object.component';

@Component({
  selector: 'app-book-section',
  standalone: true,
  imports: [CommonModule, EmptyObjectComponent],
  template: `
    <h2 class="text-primary font-semibold text-xl">{{ title }}</h2>

    <div class="flex justify-center mt-5">
      @if (empty) {
        <app-empty-object
          [emptyMessage]="emptyMessage"
          [emptyActionIcon]="emptyActionIcon"
          [emptyActionLink]="emptyActionLink"
          [emptyActionLabel]="emptyActionLabel"
        />
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
