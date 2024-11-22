import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Arma } from '../models/arma.model';

@Injectable({
  providedIn: 'root'
})
export class ArmaService {

  private baseUrl = 'http://localhost:8080/armas'

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Arma[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Arma[]>(this.baseUrl, {params}); 
  }

  findById(id: string): Observable<Arma>{
    return this.httpClient.get<Arma>(`${this.baseUrl}/${id}`);
  }

  insert(arma: Arma): Observable<Arma>{
/*    const data = {
      nome: arma.nome,
      idEstado: arma..id
    };
*/    
    return this.httpClient.post<Arma>(this.baseUrl, arma);
  }

  update(arma: Arma): Observable<Arma>{
/*    const data = {
      nome: arma.nome,
      idEstado: arma.estado.id
    };
*/
    return this.httpClient.put<Arma>(`${this.baseUrl}/${arma.id}`, arma);
  }

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`; 
  }

  delete(arma: Arma): Observable<any>{
    return this.httpClient.delete<Arma>(`${this.baseUrl}/${arma.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Arma[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<Arma[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  countBynome(nome: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }
}