import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/BlogPost';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogUrl: string = 'http://localhost:8080/api/blogs';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getHttpHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  getAll(): Observable<BlogPost[]> {
    return this.httpClient.get<BlogPost[]>(this.blogUrl, this.getHttpHeaders());
  }

  create(data: { title: string, content: string }): Observable<BlogPost> {
    return this.httpClient.post<BlogPost>(this.blogUrl, data, this.getHttpHeaders());
  }
  
  save(id: number, data: { title: string, content: string }): Observable<BlogPost> {
    return this.httpClient.patch<BlogPost>(`${this.blogUrl}/${id}`, data, this.getHttpHeaders());
  }
  
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.blogUrl}/${id}`, this.getHttpHeaders());
  }

}
