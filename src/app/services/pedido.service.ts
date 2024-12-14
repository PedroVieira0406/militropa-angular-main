import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormaDePagamento } from '../models/formaDePagamanto.model';
import { Pedido } from '../models/pedido.model';

@Injectable({
    providedIn: 'root',
})
export class PedidoService {
    private readonly baseUrl = 'http://localhost:8080/pedidos'; // URL base da API

    constructor(private http: HttpClient) { }

    insert(pedido: Pedido): Observable<Pedido> {
        return this.http.post<Pedido>(`${this.baseUrl}`, pedido);
    }

    findById(id: string): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
    }

    findAll(page?: number, pageSize?: number): Observable<Pedido[]> {

        let params = {};

        if (page !== undefined && pageSize !== undefined) {
            params = {
                page: page.toString(),
                pageSize: pageSize.toString()
            }
        }

        console.log(params);

        return this.http.get<Pedido[]>(this.baseUrl, { params });
    }

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

    delete(pedido: Pedido): Observable<any> {
        return this.http.delete<Pedido>(`${this.baseUrl}/${pedido.id}`);
    }

    findFormaDePagamento(): Observable<FormaDePagamento[]> {
        return this.http.get<FormaDePagamento[]>(`${this.baseUrl}/formaPagamento`);
    }

}
