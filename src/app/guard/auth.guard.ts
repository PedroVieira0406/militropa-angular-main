import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isTokenExpired()){
    console.log('Token inválido!');
    authService.removeToken();
    authService.removeUsuarioLogado();
    router.navigate(['/admin/login']);
    //TESTE PRA VER SE NÃO TA DEIXANDO O USUARIO ACESSAR A PAG DE ADMIN
    if(authService.getUsuarioTipo() === 'User'){
      alert('Você não tem permissão para acessar essa página!!!');
      router.navigate(['/ecommerce']);
    }
    return false;
  } else {
    console.log('Token válido!');
    return true;
  }
};