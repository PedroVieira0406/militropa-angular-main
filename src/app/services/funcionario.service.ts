import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseUrl = 'http://localhost:8080/funcionarios';

  constructor(private httpClient: HttpClient) {
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }

  findAll(page?: number, pageSize?: number): Observable<Funcionario[]> {

    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Funcionario[]>(this.baseUrl, {params}); 
  }

  findById(id: string): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(`${this.baseUrl}/${id}`); 
  }

  insert(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(this.baseUrl, funcionario);
  }

  update(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.put<any>(`${this.baseUrl}/${funcionario.id}`, funcionario); 
  }

  delete(funcionario: Funcionario): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${funcionario.id}`); 
  }

}