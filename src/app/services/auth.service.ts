import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Gửi yêu cầu đăng nhập Google tới Backend
  loginWithGoogle() {
    return this.http.get(`${this.apiUrl}/auth/google`);
  }

  // Lưu token vào localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Xóa token khi đăng xuất
  logout(): void {
    localStorage.removeItem('token');
  }
}
