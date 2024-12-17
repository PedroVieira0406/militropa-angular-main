import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { ItemPedido } from '../../models/itemPedido.model';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle, MatCardSubtitle, NgFor, NgIf, MatProgressSpinner, RouterModule, MatButtonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: ItemPedido[] = [];
  carrinhoId: number | undefined;

  constructor(
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (!usuarioLogado) {
      this.router.navigateByUrl('/login');
      return;
    }

    const cliente = JSON.parse(usuarioLogado);
    if (cliente?.id) {
      this.carrinhoService.configurarCliente(cliente.id);

      this.carrinhoService.obterCarrinho().subscribe({
        next: (itens) => {
          this.itensCarrinho = itens;
          this.recalcularSubtotais();
        },
        error: (err) => {
          console.error('Erro ao carregar o carrinho:', err);
        },
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  fecharPedido(): void {
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (!usuarioLogado) {
      this.router.navigateByUrl('/login');
      return;
    }

    const cliente = JSON.parse(usuarioLogado);
    if (cliente?.id) {
      this.carrinhoService
        .salvarPedido(cliente.id, this.itensCarrinho)
        .subscribe({
          next: (carrinho) => {
            this.carrinhoId = carrinho.id;
            alert('Pedido fechado com sucesso!');
            this.router.navigateByUrl('/realizarPagamento');
          },
          error: (err) => {
            console.error('Erro ao fechar o pedido:', err);
          },
        });
    }
  }


  removerItem(index: number): void {
    this.itensCarrinho.splice(index, 1);
    this.recalcularSubtotais();
  }

  limparCarrinho(): void {
    this.itensCarrinho = [];
    this.recalcularSubtotais();
  }

  calcularTotal(): number {
    const total = this.itensCarrinho.reduce(
      (soma, item) => soma + (item.subTotal ?? 0),
      0
    );

    return total;
  }

  recalcularSubtotais(): void {
    this.itensCarrinho.forEach((item) => {
      item.subTotal = (item.preco ?? 0) * item.quantidade;
    });
  }

  alterarQuantidade(index: number, delta: number): void {
    const item = this.itensCarrinho[index];
    if (item) {
      item.quantidade += delta;
      if (item.quantidade < 1) {
        item.quantidade = 1;
      }
      this.recalcularSubtotais();
    }
  }
}

// export class CarrinhoComponent implements OnInit {
//   carrinhoItens: ItemCarrinho[] = [];
//   pedido: Pedido []=[];
//   ItemPedidos: ItemPedido[]=[];


//   constructor(
//     private carrinhoService: CarrinhoService,
//     private authService: AuthService,
//     private snackBar: MatSnackBar,
//     private pedidoService: PedidoService,
//     private router: Router,
//   ) { }

//   ngOnInit(): void {
//     this.carrinhoService.carrinho$.subscribe(itens => {
//       this.carrinhoItens = itens;
//     });
    
//   }

//   removerItem(item: ItemCarrinho) {
//     this.carrinhoService.removerItem(item);
//   }

//   calcularTotal(): number {
//     return this.carrinhoItens.reduce((total, item) => total + item.quantidade * item.preco, 0)
//   }

//   showSnackbarTopPosition(content: any) {
//     this.snackBar.open(content, 'fechar', {
//       duration: 3000,
//       verticalPosition: "top",
//       horizontalPosition: "center"
//     });
//   }

//   finalizarCompra() {
//     const authToken = this.authService.getToken();
//     if (authToken != null) {
      
//     }
//     else {
//       this.snackBar.open('Token nulo', 'Fechar', { duration: 3000 });
//     }
//   }

// }