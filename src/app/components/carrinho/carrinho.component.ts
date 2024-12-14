import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { ItemPedido } from '../../models/itemPedido.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {
  carrinhoItens: ItemCarrinho[] = [];
  pedido: Pedido []=[];
  ItemPedidos: ItemPedido[]=[];


  constructor(
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private pedidoService: PedidoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinhoItens = itens;
    });
    
  }

  removerItem(item: ItemCarrinho) {
    this.carrinhoService.removerItem(item);
  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce((total, item) => total + item.quantidade * item.preco, 0)
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  finalizarCompra() {
    const authToken = this.authService.getToken();
    if (authToken != null) {
      
    }
    else {
      this.snackBar.open('Token nulo', 'Fechar', { duration: 3000 });
    }
  }

}