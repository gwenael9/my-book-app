import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(status: 'free' | 'unavailable' | 'reserved'): { label: string; severity: string } {
    const statusMap = {
      free: { label: 'Disponible', severity: 'success' },
      unavailable: { label: 'Indisponible', severity: 'danger' },
      reserved: { label: 'Réservé', severity: 'warning' },
    };
    return statusMap[status] || { label: status, severity: 'info' };
  }
}
