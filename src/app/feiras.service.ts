import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feira {
  feira_id?: number;
  nome: string;
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeirasService {
  private API_URL = 'http://132.145.184.44:8000/feiras';
  API_TOKEN = 'AhuAk87&%&Ajha%ahga$2851S6hdma';
  headers = new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
    'x-token': this.API_TOKEN,
  });

  constructor(private http: HttpClient) {}

  getFeiras(): Observable<Feira[]> {
    return this.http.get<Feira[]>(this.API_URL, { headers: this.headers });
  }

  adicionarFeira(Feira: Feira): Observable<Feira> {
    return this.http.post<Feira>(this.API_URL, Feira, {
      headers: this.headers,
    });
  }

  editarFeira(Feira_id: number, Feira: Feira): Observable<Feira> {
    const url = `${this.API_URL}/${Feira_id}`;

    return this.http.put<Feira>(url, Feira, { headers: this.headers });
  }

  excluirFeira(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
}
