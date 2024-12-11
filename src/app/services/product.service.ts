import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiGetProducts = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  getNewProducts(limit: number): Observable<any[]> {  // Use any[] as the return type
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('sort_by', 'created_at')
      .set('order', 'desc');

    return this.http.get<any[]>(this.apiGetProducts, { params });
  }

  getProducts(keyword: string, categoryId: number, page: number, limit: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }

  getDetailProduct(productId: number) {
    return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params });
  }

  getRecommenderProduct(productId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/products/recommendations/${productId}`);
  }

  // Thêm phương thức để cập nhật sản phẩm
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiGetProducts}/${product.id}`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiGetProducts}/${productId}`);
  }  
}
