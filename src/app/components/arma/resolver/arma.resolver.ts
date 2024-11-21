import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Arma } from '../../../models/arma.model';
import { ArmaService } from '../../../services/arma.service';

export const armaResolver: ResolveFn<Arma> = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(ArmaService).findById(route.paramMap.get('id')!); 
};
