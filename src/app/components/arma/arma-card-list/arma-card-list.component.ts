import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardFooter, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Arma } from '../../../models/arma.model';
import { ArmaService } from '../../../services/arma.service';
import { CarrinhoService } from '../../../services/carrinho.service';

type Card = {
  idArma: number,
  titulo: string;
  tipo: string
  preco: number
  imageUrl: string
}

@Component({
  selector: 'app-arma-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgFor,
    MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    RouterModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon],
  templateUrl: './arma-card-list.component.html',
  styleUrl: './arma-card-list.component.css'
})

export class ArmaCardListComponent implements OnInit {
  armas: Arma[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  constructor(private armaService: ArmaService,
                      private carrinhoService: CarrinhoService,
                      private snackBar: MatSnackBar,
                      private router:Router) {

  }
  ngOnInit(): void {
    this.buscarTodos(); // Carrega a contagem total de registros
    this.filtrar(); // Carrega os dados iniciais
  }

  carregarArmas() {
    // buscando as armas
    this.armaService.findAll(0,10).subscribe (data => {
      this.armas = data;
      this.carregarCards();
    })
  }

  carregarCards() {
    const cards: Card[] = [];
    this.armas.forEach(arma => {
      cards.push({
        idArma: arma.id,
        titulo: arma.nome,
        tipo: arma.tipoArma.label,
        preco: arma.preco,
        imageUrl: this.armaService.getUrlImage(arma.nomeImagem)
      })
    });
    this.cards.set(cards);
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('Produto adicionado ao carrinho');
    this.carrinhoService.adicionar({
      id: card.idArma,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1
    });
  }

  carrinhoDeCompras(){
    this.router.navigateByUrl('/carrinho');
  }

  login(){
    this.router.navigateByUrl('/login');
  }

  buscarArmas(): void {
    if(this.filtro){
      this.armaService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => { 
        this.armas = data;
        this.carregarCards();
      },);
    }
    else {
      this.armaService.findAll(this.page, this.pageSize).subscribe(data => { 
        this.armas = data;
        this.carregarCards();
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

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarTodos();
    this.ngOnInit();
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}
