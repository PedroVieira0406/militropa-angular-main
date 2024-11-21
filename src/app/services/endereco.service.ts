import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private baseUrl = 'http://localhost:8080/enderecos';

  constructor(private httpClient: HttpClient) {
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }

  findAll(page?: number, pageSize?: number): Observable<Endereco[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Endereco[]>(this.baseUrl, {params}); 
  }

  findById(id: string): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/${id}`);
  }

  insert(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(this.baseUrl, endereco);
  }

  update(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.put<any>(`${this.baseUrl}/${endereco.id}`, endereco);
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`);
  }

}