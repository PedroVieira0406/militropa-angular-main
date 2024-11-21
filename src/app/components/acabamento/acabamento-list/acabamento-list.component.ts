import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Acabamento } from '../../../models/acabamento.model';
import { AcabamentoService } from '../../../services/acabamento.service';

@Component({
  selector: 'app-acabamento-list',
  standalone: true,
  imports: [NgFor, MatButtonModule, RouterModule, MatIconModule, MatTableModule, MatToolbarModule],
  templateUrl: './acabamento-list.component.html',
  styleUrl: './acabamento-list.component.css'
})
export class AcabamentoListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'material', 'acao']; 
  acabamentos: Acabamento[] = [];

   // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(private acabamentoService: AcabamentoService,
              private router: Router,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.acabamentoService.findAll().subscribe(data => {
      this.acabamentos = data;
    });
  }

  excluir(acabamento: Acabamento) {
    if (acabamento.id != null) {
      this.acabamentoService.delete(acabamento).subscribe({
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
