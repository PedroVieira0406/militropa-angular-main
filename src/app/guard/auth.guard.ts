import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  try {
    // Verificar se o token está expirado
    if (authService.isTokenExpired()) {
      snackBar.open('Token inválido', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });

      authService.removeToken();
      authService.removeUsuarioLogado();
      router.navigate(['/admin/login']);
      return false;
    }

    // Verificar se o token foi modificado
    if (authService.isTokenTampered()) {
      snackBar.open('Token modificado', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });

      authService.removeToken();
      authService.removeUsuarioLogado();
      router.navigate(['/admin/login']);
      return false;
    }

    // Token válido
    return true;
  } catch (error) {
    console.error('Erro ao verificar o token:', error);

    snackBar.open('Erro de autenticação', 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    authService.removeToken();
    authService.removeUsuarioLogado();
    router.navigate(['/admin/login']);
    return false;
  }
};