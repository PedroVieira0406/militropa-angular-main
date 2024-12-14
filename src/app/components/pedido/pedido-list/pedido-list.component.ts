import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Pedido } from '../../../models/pedido.model';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-pedido-list',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    RouterModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.css'] // Corrigido para styleUrls
})
export class PedidoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'login', 'perfil', 'acao'];
  
  // Lista de pedidos e contadores
  pedidos: Pedido[] = [];
  totalRecords = 0; 
  pageSize = 5; 
  page = 0; 
  filtro: string = ''; // Filtro para pesquisa

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarPedidos(); // Carrega os pedidos ao iniciar
  }

  // Método para carregar pedidos paginados e contar registros
  carregarPedidos(): void {
    this.pedidoService.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (err) => console.error('Erro ao buscar pedidos:', err),
    });

    this.pedidoService.count().subscribe({
      next: (data) => {
        this.totalRecords = data;
      },
      error: (err) => console.error('Erro ao contar pedidos:', err),
    });
  }

  // Método para a paginação
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarPedidos(); // Recarrega os pedidos com nova paginação
  }

  // Método para excluir um pedido
  excluir(pedido: Pedido): void {
    if (pedido.id != null) {
      this.pedidoService.delete(pedido).subscribe({
        next: () => {
          this.carregarPedidos(); // Recarrega após exclusão
        },
        error: (err) => console.error('Erro ao excluir pedido:', err),
      });
    }
  }

  // Método de filtro para buscar pedidos
  filtrar(): void {
    // Implementação de filtro pode ser personalizada aqui, exemplo:
    console.log('Filtro não implementado, valor atual:', this.filtro);
    // Você pode integrar o serviço com um método de busca específico
  }
}