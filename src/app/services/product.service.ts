import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiGetProducts = `${environment.apiBaseUrl}/products`;
  private apiUrl = `${environment.apiBaseUrl}/products`; // URL for your backend API

  constructor(private http: HttpClient) { }
  

  getNewProducts(keyword: string, categoryId: number, page: number, limit: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(this.apiGetProducts, { params })
  }
  
  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<Product[]> {
    const params = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<Product[]>(`${this.apiGetProducts}`, { params });
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

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Thêm phương thức để cập nhật sản phẩm
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiGetProducts}/${product.id}`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiGetProducts}/${productId}`, { responseType: 'text' });
  }

  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
  
    return this.http.post(
      `http://localhost:8088/api/v1/products/uploads/${productId}`,
      formData
    );
  }  

  // deleteImage(imageId: number) {
  //   return this.http.delete(`http://localhost:8088/api/v1/products/images/${imageId}`);
  // }  
  deleteImage(productId: number, imageUrl: string): Observable<any> {
    const url = `${this.apiUrl}/products/${productId}/images?imageUrl=${encodeURIComponent(imageUrl)}`;
    return this.http.delete(url);
  }
  
}
