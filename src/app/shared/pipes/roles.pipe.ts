import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles',
  standalone: true,
})
export class RolesPipe implements PipeTransform {
  transform(status: 'user' | 'admin'): string {
    const statusMap = {
      user: 'Utilisateur',
      admin: 'Administrateur',
    };
    return statusMap[status];
  }
}
