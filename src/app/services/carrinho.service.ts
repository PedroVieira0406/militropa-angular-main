import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemCarrinho } from '../models/item-carrinho';
import { ItemPedido } from '../models/itemPedido.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private apiUrl = 'http://localhost:8080/pedidos';
  private itensCarrinho: Map<number, ItemPedido[]> = new Map();
  private clienteAtualId: number | null = null;
  private carrinhoAtual = new BehaviorSubject<ItemPedido[]>([]);

  constructor(private http: HttpClient) {}

  // Configurar cliente logado
  configurarCliente(idCliente: number): void {
    this.clienteAtualId = idCliente;

    if (!this.itensCarrinho.has(idCliente)) {
      this.itensCarrinho.set(idCliente, []);
    }

    this.carrinhoAtual.next(this.itensCarrinho.get(idCliente)!);
    this.getCarrinho(idCliente);
  }

  // Recuperar carrinho do backend
  getCarrinho(idCliente: number): void {
    const token = localStorage.getItem('token'); // Obter token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${this.apiUrl}/carrinho/${idCliente}`, { headers }).subscribe({
      next: (pedido) => {
        if (pedido?.itens && pedido.itens.length > 0) {
          const itens = pedido.itens.map((item: any) => ({
            id: item.id,
            quantidade: item.quantidade
          }));
          this.itensCarrinho.set(idCliente, itens);
          this.carrinhoAtual.next(itens);
        } else {
          this.itensCarrinho.set(idCliente, []);
          this.carrinhoAtual.next([]);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar carrinho do backend:', err);
      },
    });
  }

  // Adicionar item ao carrinho
  adicionarAoCarrinho(item: ItemPedido): void {
    if (this.clienteAtualId === null) {
      throw new Error('Cliente não configurado.');
    }

    const carrinho = this.itensCarrinho.get(this.clienteAtualId)!;

    const itemExistente = carrinho.find(
      (i) =>
        (i.idArma === item.idArma && item.idArma !== undefined)
    );

    if (itemExistente) {
      itemExistente.quantidade += item.quantidade;
    } else {
      carrinho.push(item);
    }

    this.carrinhoAtual.next(carrinho);
    localStorage.setItem(`carrinho_${this.clienteAtualId}`, JSON.stringify(carrinho));
  }

  // Obter itens do carrinho
  obterCarrinho(): Observable<ItemPedido[]> {
    return this.carrinhoAtual.asObservable();
  }

  salvarPedido(idCliente: number, itens: ItemPedido[]): Observable<any> {
    const token = localStorage.getItem('token'); // Obter token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      idCliente: idCliente,
      itens: itens.map((item) => ({
        idArma: item.idArma,
        quantidade: item.quantidade,
        preco: item.preco,
        subtotal: item.subTotal
      })),
    };
    return this.http.post(`${this.apiUrl}`, body, { headers });
  }

  // Limpar carrinho
  limparCarrinho(): void {
    if (this.clienteAtualId === null) {
      throw new Error('Cliente não configurado.');
    }

    this.itensCarrinho.set(this.clienteAtualId, []);
    this.carrinhoAtual.next([]);
    localStorage.removeItem(`carrinho_${this.clienteAtualId}`);
  }

  finalizarPedidoPix(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtenha o token do localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/search/pagar-Pix`, null, { headers });
  }

  finalizarPedidoBoleto(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtenha o token do localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/search/pagar-Boleto`, null, { headers });
  }

}

//   private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
//   carrinho$ = this.carrinhoSubject.asObservable();

//   constructor(private localStorageService: LocalStorageService) {
//     // verificando se tem dados no carrinho no local storage e atualiza o subject
//     const carrinhoArmazenado = localStorageService.getItem('carrinho') || [];
//     this.carrinhoSubject.next(carrinhoArmazenado);
//   }

//   adicionar(itemCarrinho: ItemCarrinho): void {
//     const carrinhoAtual = this.carrinhoSubject.value;
//     const itemExistente = carrinhoAtual.find(item => item.id === itemCarrinho.id);
  
//     if(itemExistente){
//       itemExistente.quantidade += itemCarrinho.quantidade || 1;
//     } else {
//       carrinhoAtual.push(itemCarrinho);
//     }
//     this.carrinhoSubject.next(carrinhoAtual);
//     // lembrar de fazer a atualização local
//     this.atualizarArmazenamentoLocal();
//   }

//   removerTudo(): void{
//     this.localStorageService.removeItem('carrinho');
//     //window.location.reload(); //reload na pag
//   }

//   removerItem(itemCarrinho: ItemCarrinho): void{
//     const carrinhoAtual = this.carrinhoSubject.value;
//     const carrinhoAtualizado = carrinhoAtual.filter(item => item.id !== itemCarrinho.id);
    
//     this.carrinhoSubject.next(carrinhoAtualizado);
//     //lembrar de fazer a atualização local
//     this.atualizarArmazenamentoLocal();
//   }

//   obter(): ItemCarrinho[] {
//     return this.carrinhoSubject.value;
//   }

//   private atualizarArmazenamentoLocal(): void{
//     this.localStorageService.setItem('carrinho', this.carrinhoSubject.value);
//   }
// }