import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  template: `
    <p-table
      [value]="data"
      [rows]="rowsPerPage"
      [rowsPerPageOptions]="rowsPerPageOptions"
      [paginator]="paginator"
      stripedRows
    >
      <ng-template #header>
        <tr>
          @for (col of columns; track trackByCol(col)) {
            <th style="text-align:center">{{ col }}</th>
          }
        </tr>
      </ng-template>

      <ng-template #body let-row>
        <tr>
          <ng-container *ngTemplateOutlet="rowTemplate; context: { $implicit: row }"></ng-container>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class GenericTableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: string[] = [];
  @Input() rowTemplate!: TemplateRef<unknown>;
  @Input() rowsPerPage = 5;
  @Input() rowsPerPageOptions = [2, 5, 10];
  @Input() paginator = true;

  trackByCol = (col: string) => this.columns.indexOf(col);
}
