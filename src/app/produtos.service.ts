import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  produto_id?: number;
  estoque_id?: number;
  nome: string;
  descricao: string;
  categoria?: string;
  preco_unitario: string;
  peso_gramas: number;
  data_criacao?: string;
  status?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  // private readonly API_URL = 'http://132.145.184.44/api/produtos/';
    private API_URL = '/api/produtos/';
  private readonly API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma';

  private readonly headers = new HttpHeaders({
    'x-token': this.API_TOKEN,
  });

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    const params = new HttpParams()
              .set('limit', 9999999999999);
    return this.http.get<Produto[]>(this.API_URL, {
      headers: this.headers,params
    });
  }

  getProdutosPorFeira(feiraId: number, skip = 0, limit = 99999999999): Observable<Produto[]> {
  const params = {
    skip: skip.toString(),
    limit: limit.toString(),
    feira_id: feiraId.toString(),
  };

  return this.http.get<Produto[]>(this.API_URL, {
    headers: this.headers,
    params,
  });
}

  adicionarProduto(produto: Produto): Observable<Produto> {
    const postHeaders = this.headers.set('Content-Type', 'application/json');
    return this.http.post<Produto>(this.API_URL, produto, {
      headers: postHeaders,
    });
  }

  editarProduto(produto_id: number, produto: Produto): Observable<Produto> {
    const url = `${this.API_URL}${produto_id}`;
    const putHeaders = this.headers.set('Content-Type', 'application/json');
    return this.http.put<Produto>(url, produto, {
      headers: putHeaders,
    });
  }

  excluirProduto(id: number | undefined): Observable<any> {
    const url = `${this.API_URL}${id}`;
    return this.http.delete(url, {
      headers: this.headers,
    });
  }
}
