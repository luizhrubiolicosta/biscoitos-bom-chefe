import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from './produtos.service';

export interface Estoque {
  estoque_id?: number;
  produto?: Produto;
  produto_id: number;
  quantidade: number;
  lote: string;
  data_producao: string;
  data_validade: string;
  localizacao: string;
  data_atualizacao: string;
}

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  private API_URL = 'http://132.145.184.44:8000/estoques';
  API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma';
  headers = new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
    'x-token': this.API_TOKEN,
  });

  constructor(private http: HttpClient) {}

  getEstoques(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.API_URL, { headers: this.headers });
  }

  adicionarEstoque(Estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(this.API_URL, Estoque, {
      headers: this.headers,
    });
  }

  editarEstoque(Estoque_id: number, Estoque: Estoque): Observable<Estoque> {
    const url = `${this.API_URL}/${Estoque_id}`;

    return this.http.put<Estoque>(url, Estoque, { headers: this.headers });
  }

  excluirEstoque(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
}
