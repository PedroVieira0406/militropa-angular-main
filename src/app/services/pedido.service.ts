import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { ItemPedido } from '../models/itemPedido.model';

@Injectable({
    providedIn: 'root',
})
export class PedidoService {
    private readonly baseUrl = 'http://localhost:8080/pedidos'; // URL base da API

    constructor(private http: HttpClient) { }

    /**
     * Insere um novo pedido.
     * @param pedido Pedido a ser inserido.
     * @param idCliente ID do cliente associado ao pedido.
     * @returns Observable com os dados do pedido criado.
     */
    insert(pedido: Pedido, idCliente: number): Observable<Pedido> {
        return this.http.post<Pedido>(`${this.baseUrl}/cliente/${idCliente}`, pedido);
    }

    /**
     * Busca um pedido pelo ID.
     * @param id ID do pedido.
     * @returns Observable com os dados do pedido.
     */
    findById(id: number): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
    }

    /**
     * Busca todos os pedidos com paginação.
     * @param page Número da página.
     * @param pageSize Tamanho da página.
     * @returns Observable com a lista de pedidos.
     */
    findAll(page: number, pageSize: number): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
    }

    /**
     * Busca todos os pedidos de um cliente específico.
     * @param idCliente ID do cliente.
     * @returns Observable com a lista de pedidos do cliente.
     */
    findByCliente(idCliente: number): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.baseUrl}/cliente/${idCliente}`);
    }

    /**
     * Altera o status de pagamento de um pedido.
     * @param id ID do pedido.
     * @returns Observable sem resposta (void).
     */
    alterarStatusPagamento(id: number): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}/alterar-status`, null);
    }

    /**
     * Busca os pedidos do cliente logado.
     * @returns Observable com a lista de pedidos do cliente logado.
     */
    meusPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.baseUrl}/meus-pedidos`);
    }

    /**
     * Obtém o número total de pedidos cadastrados.
     * @returns Observable com a contagem de pedidos.
     */
    count(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/count`);
    }
}
