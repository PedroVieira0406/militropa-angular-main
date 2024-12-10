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
import { Arma } from '../../../models/arma.model';
import { ArmaService } from '../../../services/arma.service';

@Component({
  selector: 'app-arma-list',
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
    MatInputModule],
  templateUrl: './arma-list.component.html',
  styleUrl: './arma-list.component.css'
})
export class ArmaListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome','tipoArma','modelo','acao'];
  armas: Arma[] = [];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  constructor(private armaService: ArmaService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.armaService.findAll(this.page, this.pageSize).subscribe(data => {
      this.armas = data;
      console.log(this.armas);
    });

    this.armaService.count().subscribe(data => {
      this.totalRecords = data;
      console.log(this.armas);
    });

    this.buscarArmas();
    this.buscarTodos();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarTodos();
    this.ngOnInit();
  }



  excluir(arma: Arma): void {
    if (arma.id != null) {
      this.armaService.delete(arma).subscribe({
        next: () => this.ngOnInit(), // Recarrega os dados após exclusão
        error: err => console.error('Erro ao excluir', err)
      });
    }
  }

  buscarArmas(): void {
    if (this.filtro) {
      this.armaService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.armas = data;
      },);
    }
    else {
      this.armaService.findAll(this.page, this.pageSize).subscribe(data => {
        this.armas = data;
      },);
    }
  }

  buscarTodos(): void {
    const count$ = this.filtro
      ? this.armaService.countBynome(this.filtro)
      : this.armaService.count();

    count$.subscribe(
      data => {
        this.totalRecords = data;
      },
      error => console.error('Erro ao contar usuários', error)
    );
  }

  filtrar(): void {
    this.buscarTodos();
    this.buscarArmas();
  }
}