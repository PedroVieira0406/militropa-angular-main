import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Arma } from '../../../models/arma.model';
import { AcabamentoService } from '../../../services/acabamento.service';
import { ArmaService } from '../../../services/arma.service'; // Serviço para obter dados da arma (se houver)
import { CarrinhoService } from '../../../services/carrinho.service';

@Component({
  selector: 'app-info-detalhes',
  standalone: true,
  imports: [NgIf, MatCard, MatCardTitle, MatCardContent,MatCardActions],
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.css',]
})
export class InfoFormComponent implements OnInit {
  arma: any = {}; // Arma a ser exibida
  armaId: string = '';

  constructor(
    private route: ActivatedRoute,
    private armaService: ArmaService,
    private carrinhoService: CarrinhoService,
    private acabamentoService: AcabamentoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Obtém o ID da arma da URL
    this.armaId = this.route.snapshot.paramMap.get('id') || '';
    this.acabamentoService.findAll().subscribe(data => {
      this.arma.acabamentoIds = data;
    })
    this.loadArmaDetalhes();
  }

  loadArmaDetalhes(): void {
    // Chama o serviço para obter os dados da arma usando o ID
    this.armaService.findById(this.armaId).subscribe((data) => {
      this.arma = data; // Armazena as informações da arma
      // Chama o serviço para pegar a URL da imagem, passando o nome da imagem
      this.arma.imageUrl = this.armaService.getUrlImage(data.nomeImagem);
    });
  }

  adicionarAoCarrinho(card: Arma) {
    this.showSnackbarTopPosition('Produto adicionado ao carrinho');
    this.carrinhoService.adicionarAoCarrinho({
      quantidade: 1,
      idArma: card.id,
      nome: card.nome,
      subTotal: card.preco,
      preco: card.preco,
      imageUrl: card.nomeImagem

    });
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}