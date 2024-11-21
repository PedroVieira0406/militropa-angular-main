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
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
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
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'] // Corrigido para styleUrls
})
export class UsuarioListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'login', 'perfil', 'acao'];
  usuarios: Usuario[] = [];
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  filtro: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.findAll(this.page, this.pageSize).subscribe(data =>{
      this.usuarios = data;
      console.log(this.usuarios);
    });

    this.usuarioService.count().subscribe(data =>{
      this.totalRecords = data;
      console.log(this.usuarios);
  });

  this.buscarUsuarios();
  this.buscarTodos();
  }
  
  /*
  loadData(): void {
    const usuarios$ = this.usuarioService.findAll(this.page, this.pageSize);
    const totalRecords$ = this.usuarioService.count();

    forkJoin([usuarios$, totalRecords$]).subscribe(
      ([usuarios, totalRecords]) => {
        this.usuarios = usuarios;
        this.totalRecords = totalRecords;
      },
      error => console.error('Erro ao carregar dados', error)
    );
  }
  */

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarTodos();
    this.ngOnInit();
  }


  
  excluir(usuario: Usuario): void {
    if (usuario.id != null) {
      this.usuarioService.delete(usuario).subscribe({
        next: () => this.ngOnInit(), // Recarrega os dados após exclusão
        error: err => console.error('Erro ao excluir', err)
      });
    }
  }

  buscarUsuarios(): void {
    if(this.filtro){
      this.usuarioService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => { 
        this.usuarios = data;
      },);
    }
    else {
      this.usuarioService.findAll(this.page, this.pageSize).subscribe(data => { 
        this.usuarios = data;
      },);
    }
  }

  buscarTodos(): void {
    const count$ = this.filtro 
      ? this.usuarioService.countBynome(this.filtro) 
      : this.usuarioService.count();

    count$.subscribe(
      data => { 
        this.totalRecords = data; 
      },
      error => console.error('Erro ao contar usuários', error)
    );
  }

  filtrar(): void {
    this.buscarTodos();
    this.buscarUsuarios();
  }
}