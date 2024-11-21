import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';


@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private baseUrl = './assets/Cidades.json'

  constructor(private httpClient: HttpClient) { }


  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }

  findAll(page?: number, pageSize?: number): Observable<Municipio[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Municipio[]>(this.baseUrl, {params}); 
  }

  findById(id: string): Observable<Municipio>{
    return this.httpClient.get<Municipio>(`${this.baseUrl}/${id}`);
  }

  insert(municipio: Municipio): Observable<Municipio>{
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    };
    return this.httpClient.post<Municipio>(this.baseUrl, data);
  }

  update(municipio: Municipio): Observable<Municipio>{
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    };
    return this.httpClient.put<Municipio>(`${this.baseUrl}/${municipio.id}`, data);
  }

  delete(municipio: Municipio): Observable<any>{
    return this.httpClient.delete<Municipio>(`${this.baseUrl}/${municipio.id}`);
  }
}
