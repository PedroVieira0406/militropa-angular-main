import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ClienteCadastro } from '../models/clienteCadastro';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';
  private cadastroUrl= 'http://localhost:8080/cadastro';

  constructor(private httpClient: HttpClient) {
  }

  findAll(page?: number, pageSize?: number): Observable<Cliente[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Cliente[]>(this.baseUrl, {params});
  }

  findById(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  insert(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.baseUrl, cliente);
  }

  insertClienteCadastro(cliente: ClienteCadastro): Observable<ClienteCadastro> {
    return this.httpClient.post<ClienteCadastro>(this.cadastroUrl, cliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<any>(`${this.baseUrl}/${cliente.id}`, cliente);
  }

  delete(cliente: Cliente): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${cliente.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}