import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiGetCategories  = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) { }

  getCategories(page: number, limit: number): Observable<Category[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());     
    return this.http.get<Category[]>(this.apiGetCategories, { params });           
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiGetCategories}/${id}`, category);
  }
  
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiGetCategories}/${id}`, { responseType: 'text' });
  }

  // Add a new method for creating a category
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiGetCategories, category);
  }  
}
