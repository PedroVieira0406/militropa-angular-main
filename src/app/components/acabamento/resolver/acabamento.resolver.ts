import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Acabamento } from '../../../models/acabamento.model';
import { AcabamentoService } from '../../../services/acabamento.service';

export const acabamentoResolver: ResolveFn<Acabamento> = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AcabamentoService).findById(route.paramMap.get('id')!); 
};
