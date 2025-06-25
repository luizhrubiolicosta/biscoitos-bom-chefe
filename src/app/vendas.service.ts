import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  item_de_estoque_utilizado?: {
          estoque_id: number,
          produto: {
            produto_id: number,
            nome: string
          }
}
}

export interface PostItensVendas {
  quantidade: number;
  preco_unitario: number;
  estoque_id: number;
}

export interface PostVendas {
  venda_id?: number
  itens_venda: PostItensVendas[];
  feira_id: number;
  status_venda?: string;
  valor_total?: number;
  cliente_id?: number | null;
  feira?: Feira
}

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  // private readonly API_URL = 'http://132.145.184.44/api/vendas/';
    private API_URL = '/api/vendas/';
  private readonly API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma';

  private readonly baseHeaders = new HttpHeaders({
    'x-token': this.API_TOKEN,
  });

  constructor(private http: HttpClient) {}

  getVendas(): Observable<Vendas[]> {
    const params = new HttpParams()
                  .set('limit', 9999999999999);
    return this.http.get<Vendas[]>(this.API_URL, {
      headers: this.baseHeaders,params
    });
  }

  adicionarVendas(vendas: PostVendas): Observable<PostVendas> {
    const headers = this.baseHeaders.set('Content-Type', 'application/json');
    return this.http.post<PostVendas>(this.API_URL, vendas, {
      headers,
    });
  }

  consolidarVendas(venda_id: number): Observable<PostVendas> {
    const headers = this.baseHeaders.set('Content-Type', 'application/json');
    return this.http.post<PostVendas>(`${this.API_URL}/consolidar/`, {venda_id}, {
      headers,
    });
  }

  editarVendas(vendas_id: number, vendas: PostVendas): Observable<PostVendas> {
    const url = `${this.API_URL}/${vendas_id}`;
    const headers = this.baseHeaders.set('Content-Type', 'application/json');
    return this.http.put<PostVendas>(url, vendas, {
      headers,
    });
  }

  excluirVendas(id: number | undefined): Observable<any> {
    const url = `${this.API_URL}${id}`;
    return this.http.delete(url, {
      headers: this.baseHeaders,
    });
  }
}
