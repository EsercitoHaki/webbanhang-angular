import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiGetComments = `${environment.apiBaseUrl}/comments`;

  constructor (private http: HttpClient) {}

  getCommentsByProduct(productId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiGetComments}?product_id=${productId}`);
  }
}