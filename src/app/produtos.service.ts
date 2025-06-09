
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  produto_id?: number;
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
  private API_URL = '/api/produtos/';
     API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma'
       headers = new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'x-token': this.API_TOKEN,
      });

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API_URL, { headers: this.headers });
  }

  adicionarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API_URL, produto, { headers: this.headers });
  }

 editarProduto(produto_id: number, produto: Produto): Observable<Produto> {
  const url = `${this.API_URL}/${produto_id}`;

  return this.http.put<Produto>(url, produto, { headers: this.headers });
}

  excluirProduto(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
}
