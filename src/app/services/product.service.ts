import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiGetProducts = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }
  
  // getNewProducts(keyword: string, categoryId: number, page: number, limit: number): Observable<any[]> {
  //   const params = new HttpParams()
  //     .set('keyword', keyword)
  //     .set('category_id', categoryId.toString())
  //     .set('page', page.toString())
  //     .set('limit', limit.toString());
  
  //   return this.http.get<any>(this.apiGetProducts, { params }).pipe(
  //     map(response => {
  //       console.log('API response:', response); 
  
  //       const products = response.products; 
  //       if (Array.isArray(products)) {
  //         return products
  //           .sort((a, b) => a.productId - b.productId) 
  //           .slice(0, 10)
  //           .map(product => ({
  //             id: product.productId,        
  //             name: product.name,           
  //             thumbnail: product.thumbnail 
  //           }));
  //       } else {
  //         console.error('API response does not contain a valid products array:', products);
  //         return [];
  //       }
  //     })
  //   );
  // }
  
  getNewProducts(keyword: string, categoryId: number, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    return this.http.get<any>(this.apiGetProducts, { params }).pipe(
      map(response => {
        console.log('API response:', response);
        const filteredProducts = response.products.filter((product: any) => 
          product.productId >= 1 && product.productId <= 10
        );
        return filteredProducts;
      })
    );
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

  // Thêm phương thức để cập nhật sản phẩm
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiGetProducts}/${product.id}`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiGetProducts}/${productId}`);
  }  
}
