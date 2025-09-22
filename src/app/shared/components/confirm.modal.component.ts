import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  template: `
    <p-dialog [(visible)]="visible" [modal]="true" [closable]="false" [header]="title">
      <span class="p-text-secondary block mb-8">
        Voulez-vous vraiment supprimer <strong>{{ name }}</strong> ? Cette action est irréversible.
      </span>
      <div class="flex justify-end gap-4">
        <p-button label="Annuler" (click)="cancel()" severity="secondary"></p-button>
        <p-button label="Confirmer" (click)="confirm()" severity="danger"></p-button>
      </div>
    </p-dialog>
  `,
})
export class ConfirmModalComponent {
  @Input() title = 'Confirmation';
  @Input() name?: string;
  @Input() visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();

  cancel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  confirm() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.confirmed.emit();
  }
}
