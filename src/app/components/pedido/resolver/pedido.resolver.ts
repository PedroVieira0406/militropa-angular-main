import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Pedido } from '../../../models/pedido.model';
import { PedidoService } from '../../../services/pedido.service';

export const pedidoResolver: ResolveFn<Pedido> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(PedidoService).findById(route.paramMap.get('id')!);
}
