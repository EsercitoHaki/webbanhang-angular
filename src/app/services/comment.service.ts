import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';
import { CommentDTO } from '../dtos/comment.dto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiGetComments = `${environment.apiBaseUrl}/comments`;
  private apiPostComment = `${environment.apiBaseUrl}/comments`;

  constructor (private http: HttpClient) {}

  getCommentsByProduct(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiGetComments}?product_id=${productId}`);
  }

  addComment(commentDTO: CommentDTO): Observable<any> {
    return this.http.post(this.apiPostComment, commentDTO, { responseType: 'text' });
  }

  replyToComment(parentId: number, replyDTO: CommentDTO): Observable<any> {
    return this.http.post(`${this.apiPostComment}/reply/${parentId}`, replyDTO, { responseType: 'text' });
  }
}
