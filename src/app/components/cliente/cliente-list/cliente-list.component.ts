import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule,
    MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'usuario', 'acao'];
  clientes: Cliente[] = [];

  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(private clienteService: ClienteService,
              private router: Router,
              private cdr: ChangeDetectorRef) {

  }
  

  ngOnInit(): void {
    this.clienteService.findAll(this.page, this.pageSize).subscribe(
      data => { this.clientes = data }
    );

    this.clienteService.count().subscribe(
      data => { this.totalRecords = data }
    );

  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }
  
  excluir(cliente: Cliente) {
    if (cliente.id != null) {
      this.clienteService.delete(cliente).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (err) => {
          console.log("não entrou");
          console.log('Erro ao Excluir' + JSON.stringify(err));
        }
      });
    }
  }

}