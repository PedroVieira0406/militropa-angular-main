import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardFooter, MatCardModule, MatCardTitle } from '@angular/material/card';
import { Arma } from '../../../models/arma.model';
import { ArmaService } from '../../../services/arma.service';

type Card = {
  titulo: string;
  modalidade: string
  preco: number
  imageUrl: string
}

@Component({
  selector: 'app-arma-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgFor, 
    MatCardActions, MatCardContent, MatCardTitle, MatCardFooter],
  templateUrl: './arma-card-list.component.html',
  styleUrl: './arma-card-list.component.css'
})
export class ArmaCardListComponent implements OnInit {
  armas: Arma[] = [];
  cards = signal<Card[]>([]);

  constructor(private armaService: ArmaService) {

  }
  ngOnInit(): void {
    this.carregarArmas();
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
        titulo: arma.nome,
        modalidade: arma.modelo,
        preco: arma.preco,
        imageUrl: this.armaService.getUrlImage(arma.nomeImagem)
      })
    });
    this.cards.set(cards);
  }

  

}
