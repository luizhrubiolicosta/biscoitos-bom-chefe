import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return of(
      email === 'biscoitobomchefe@gmail.com' && password === 'biscoitosbomchefe'
    );
  }
}
