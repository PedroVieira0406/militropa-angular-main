import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) {
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`); 
  }

  findAll(page?: number, pageSize?: number): Observable<Usuario[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Usuario[]>(this.baseUrl, {params});
  }

  findById(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`); 
  }

  insert(usuario: Usuario): Observable<Usuario> {
    const data = {
      login: usuario.login,
      senha: usuario.senha,
      perfil: usuario.perfil
    };
    return this.httpClient.post<Usuario>(this.baseUrl, data);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<any>(`${this.baseUrl}/${usuario.id}`, usuario); 
  }

  delete(usuario: Usuario): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${usuario.id}`); 
  }

  countBynome(nome: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Usuario[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<Usuario[]>(`${this.baseUrl}/search/login/${nome}`, { params });
  }

  alterarSenha(senhaAntiga: string, senhaNova: string): Observable<void> {
    return this.httpClient.put<void>(`/usuariologado/alterar-senha`, {senhaAntiga, senhaNova});
  }

  alterarLogin(login: string): Observable<void> {
    return this.httpClient.put<void>(`/usuariologado/alterar-login`, login);
  }

}