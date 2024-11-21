import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Acabamento } from '../models/acabamento.model';

@Injectable({
  providedIn: 'root'
})
export class AcabamentoService {

  private baseUrl = 'http://localhost:8080/acabamentos'

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Acabamento[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Acabamento[]>(this.baseUrl, {params}); 
  }

  findById(id: string): Observable<Acabamento>{
    return this.httpClient.get<Acabamento>(`${this.baseUrl}/${id}`);
  }

  insert(acabamento: Acabamento): Observable<Acabamento>{
/*    const data = {
      nome: arma.nome,
      idEstado: arma..id
    };
*/    
    return this.httpClient.post<Acabamento>(this.baseUrl, acabamento);
  }

  update(acabamento: Acabamento): Observable<Acabamento>{
/*    const data = {
      nome: arma.nome,
      idEstado: arma.estado.id
    };
*/
    return this.httpClient.put<Acabamento>(`${this.baseUrl}/${acabamento.id}`, acabamento);
  }

  delete(arma: Acabamento): Observable<any>{
    return this.httpClient.delete<Acabamento>(`${this.baseUrl}/${arma.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }
}
