import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ClienteCadastro } from '../models/clienteCadastro';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';
  private cadastroUrl= 'http://localhost:8080/cadastro';

  constructor(private httpClient: HttpClient,
    private router: Router,
  ) {
    
  }
  private getHeaders(): HttpHeaders {
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('Usuário não autenticado');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
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
    const headers = this.getHeaders();
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