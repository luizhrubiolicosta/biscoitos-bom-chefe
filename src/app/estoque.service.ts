import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from './produtos.service';
import { Feira } from './feiras.service';

export interface VendasAssociadasAEsteEstoque {
  item_venda_id: number;
  venda_id: number;
  estoque_id: number;
  quantidade: number;
  preco_unitario: string;
}

export interface MovimentacoesEstoque {
  produto_id: number;
  estoque_id: number;
  quantidade_alterada: number;
  tipo_movimentacao: string;
  feira_id: number;
  venda_id?: number;
  item_venda_id?: number;
  observacao: string;
  data_movimentacao: string;
  movimentacao_id: number;
  produto: Produto;
}

export interface Estoque {
  estoque_id?: number;
  produto_id: number;
  feira_id: number;
  quantidade: number;
  lote: string;
  data_producao: string;
  data_validade: string;
  localizacao: string;
  data_atualizacao: string;
  produto?: Produto;
  feira?: Feira;
  movimentacoes_estoque?: MovimentacoesEstoque;
  vendas_associadas_a_este_estoque?: VendasAssociadasAEsteEstoque;
}

export interface PostEstoque {
  produto_id: number;
  feira_id: number;
  quantidade: number;
  lote: string;
  data_producao: string;
  data_validade: string;
  localizacao: string;
  data_atualizacao: string;
}

export interface MovimentarEstoque {
  produto_id: number;
  feira_id_destino: number;
  quantidade_a_mover: number;
}

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  // private readonly API_URL = 'http://132.145.184.44/api/estoques/';
    private API_URL = '/api/estoques/';
  private readonly API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma';

  private readonly getHeaders = new HttpHeaders({
    accept: 'application/json',
    'x-token': this.API_TOKEN,
  });

  private readonly writeHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-token': this.API_TOKEN,
  });

  constructor(private http: HttpClient) {}

  getEstoques(): Observable<Estoque[]> {
    const params = new HttpParams()
      .set('limit', 9999999999999);
    return this.http.get<Estoque[]>(this.API_URL, {
      headers: this.getHeaders, params
    });
  }

  getProdutosEstoques(id: number): Observable<Estoque[]> {
       const params = new HttpParams()
      .set('limit', 9999999999999);
    return this.http.get<Estoque[]>(`${this.API_URL}produto/${id}`, {
      headers: this.getHeaders,params
    });
  }

  adicionarEstoque(estoque: PostEstoque): Observable<PostEstoque> {
    return this.http.post<PostEstoque>(this.API_URL, estoque, {
      headers: this.writeHeaders,
    });
  }

  moverEstoque(estoque: MovimentarEstoque): Observable<MovimentarEstoque> {
    return this.http.post<MovimentarEstoque>(
      `${this.API_URL}movimentar-para-feira/`,
      estoque,
      {
        headers: this.writeHeaders,
      }
    );
  }

  editarEstoque(estoque_id: number, estoque: PostEstoque): Observable<PostEstoque> {
    return this.http.put<PostEstoque>(`${this.API_URL}${estoque_id}`, estoque, {
      headers: this.writeHeaders,
    });
  }

  excluirEstoque(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.API_URL}${id}`, {
      headers: this.writeHeaders,
    });
  }
}
