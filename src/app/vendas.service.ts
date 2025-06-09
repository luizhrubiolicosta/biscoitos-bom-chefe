import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Feira } from './feiras.service';

export interface Vendas {
  itens_venda: ItensVendas[];
  feira: Feira;
  data_venda: string;
  venda_id?: number;
  feira_id: number;
  data_atualizacao?: string;
  status_venda?: string;
  metodo_pagamento?: string;
  valor_total?: string;
  cliente_id?: number;
}
export interface ItensVendas {
  quantidade: number;
  produto_id: number;
  preco_unitario: number;
  nome_produto?: string;
}

export interface PostVendas {
  itens_venda: ItensVendas[];
  feira_id: number;
  status_venda?: string;
  valor_total?: string;
  cliente_id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  // mockedVenda: Vendas[] = [
  //   {
  //     venda_id: 1,
  //     itens_venda: [{ quantidade: 1, produto_id: 1, preco_unitario: 1 }],
  //     feira: { feira_id: 1, nome: 'Feira Gutierrez' },
  //     data_venda: '2025/05/29',
  //     feira_id: 1,
  //     data_atualizacao: '2025/05/29',
  //     valor_total: 'R$3,00',
  //   },
  // ];

  private API_URL = 'http://132.145.184.44:8000/vendas';
  API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma';
  headers = new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
    'x-token': this.API_TOKEN,
  });

  constructor(private http: HttpClient) {}

  getVendas(): Observable<Vendas[]> {
    return this.http.get<Vendas[]>(this.API_URL, { headers: this.headers });
  }

  adicionarVendas(Vendas: PostVendas): Observable<PostVendas> {
    return this.http.post<PostVendas>(this.API_URL, Vendas, {
      headers: this.headers,
    });
  }

  consolidarVendas(feira_id: number): Observable<PostVendas> {
    return this.http.post<PostVendas>(`${this.API_URL}/consolidar/`, feira_id, {
      headers: this.headers,
    });
  }

  editarVendas(Vendas_id: number, Vendas: PostVendas): Observable<PostVendas> {
    const url = `${this.API_URL}/${Vendas_id}`;

    return this.http.put<PostVendas>(url, Vendas, { headers: this.headers });
  }

  excluirVendas(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
}
