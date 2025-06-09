import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from './produtos.service';
import { Feira } from './feiras.service';

export interface VendasAssociadasAEsteEstoque {
        item_venda_id: number,
        venda_id: number,
        estoque_id: number,
        quantidade: number,
        preco_unitario: string
}
export interface MovimentacoesEstoque {
        produto_id: number,
        estoque_id: number,
        quantidade_alterada: number,
        tipo_movimentacao: string,
        feira_id: number,
        venda_id?: number,
        item_venda_id?: number,
        observacao: string,
        data_movimentacao: string,
        movimentacao_id: number,
        produto: Produto
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
  feira?: Feira
  movimentacoes_estoque? : MovimentacoesEstoque
  vendas_associadas_a_este_estoque?: VendasAssociadasAEsteEstoque
}
export interface PostEstoque {
  produto_id: number,
  feira_id: number,
  quantidade: number,
  lote: string,
  data_producao: string,
  data_validade: string,
  localizacao: string,
  data_atualizacao: string
}

export interface MovimentarEstoque {
  produto_id: number,
  feira_id_destino: number,
  quantidade_a_mover: number,
}

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  private API_URL = '/api/estoques/';
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

  adicionarEstoque(estoque: PostEstoque): Observable<PostEstoque> {
    return this.http.post<PostEstoque>(this.API_URL, estoque, {
      headers: this.headers,
    });
  }

    moverEstoque(estoque: MovimentarEstoque): Observable<MovimentarEstoque> {
    return this.http.post<MovimentarEstoque>(`${this.API_URL}/movimentar-para-feira/`, estoque, {
      headers: this.headers,
    });
  }

  editarEstoque(Estoque_id: number, Estoque: PostEstoque): Observable<PostEstoque> {
    const url = `${this.API_URL}/${Estoque_id}`;

    return this.http.put<PostEstoque>(url, Estoque, { headers: this.headers });
  }

  excluirEstoque(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
}
