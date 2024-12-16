import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Arma } from '../models/arma.model';
import { TipoArma } from '../models/tipoArma.model';
import { EnderecoViaCep } from '../models/enderecoViaCep.model';


@Injectable({
  providedIn: 'root'
})
export class CepService {

  private baseUrl = 'https://viacep.com.br/ws'

  constructor(private httpClient: HttpClient) { }

  getEnderecoByCep(cep: string): Observable<EnderecoViaCep> {
    return this.httpClient.get<EnderecoViaCep>(`${this.baseUrl}/${cep}/json`); 
  }
}