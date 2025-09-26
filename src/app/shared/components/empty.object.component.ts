import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-empty-object',
  standalone: true,
  imports: [Button, RouterModule],
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="text-center font-semibold text-gray-500">
        {{ emptyMessage }}
      </p>
      <p-button
        [routerLink]="emptyActionLink"
        [label]="emptyActionLabel"
        [icon]="emptyActionIcon"
      ></p-button>
    </div>
  `,
})
export class EmptyObjectComponent {
  @Input() emptyMessage = 'Aucun élément.';
  @Input() emptyActionLink!: string;
  @Input() emptyActionLabel?: string;
  @Input() emptyActionIcon = 'pi pi-book';
}
