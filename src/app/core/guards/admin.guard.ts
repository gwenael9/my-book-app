import { AuthService } from '@/features/auth/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser$();
  if (user?.role === 'admin') return true;

  router.navigate(['/books']);
  return false;
};
