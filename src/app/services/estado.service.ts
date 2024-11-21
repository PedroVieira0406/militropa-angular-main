import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseUrl = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) {
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }

  findAll(page?: number, pageSize?: number): Observable<Estado[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Estado[]>(this.baseUrl, {params}); 
  }

  findById(id: string): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/${id}`); 
  }

  insert(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(this.baseUrl, estado);
  }

  update(estado: Estado): Observable<Estado> {
    return this.httpClient.put<any>(`${this.baseUrl}/${estado.id}`, estado); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`); 
  }

}
