import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = 'http://localhost:8080/api/auth';

  constructor(private httpClient: HttpClient) { }

  login(data: { email: string, password: string }): Observable<string> {
    return this.httpClient.post(`${this.authUrl}/login`, data)
      .pipe(
        map((resp: any) => resp.token),
        tap((token: string) => {
          localStorage.setItem('auth_token', token);
        })
      );
  }

  getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

}
