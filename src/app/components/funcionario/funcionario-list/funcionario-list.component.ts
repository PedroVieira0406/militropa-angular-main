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
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../../../services/funcionario.service';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatMenuModule,
    MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css'
})
export class FuncionarioListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'login', 'acao'];
  funcionarios: Funcionario[] = [];

  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(private funcionarioService: FuncionarioService) {

  }
  ngOnInit(): void {
    this.funcionarioService.findAll(this.page, this.pageSize).subscribe(
      data => { this.funcionarios = data }
    );

    this.funcionarioService.count().subscribe(
      data => { this.totalRecords = data }
    );

  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }
  
  
  excluir(funcionario: Funcionario): void {
    if (funcionario.id != null) {
      this.funcionarioService.delete(funcionario).subscribe({
        next: () => this.ngOnInit(), // Recarrega os dados após exclusão
        error: err => console.error('Erro ao excluir', err)
      });
    }
  }

}