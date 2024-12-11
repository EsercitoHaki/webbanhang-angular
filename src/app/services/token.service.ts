import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private jwtHelperService = new JwtHelperService();
    constructor() { }
    //getter/setter
    getToken(key: string = 'access_token'): string {
        return localStorage.getItem(key) ?? '';
    }

    setToken(token: string, key: string = 'authToken'): void {
        localStorage.setItem(key, token); // Hoặc sử dụng sessionStorage.setItem nếu muốn lưu trong sessionStorage
    }


    getUserId(): number {
        let userObject = this.jwtHelperService.decodeToken(this.getToken() ?? '');
        return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
    isTokenExpired(key: string = 'access_token'): boolean {
        const token = this.getToken(key);
        if (!token) {
            return true; // Không có token => hết hạn
        }
        return this.jwtHelperService.isTokenExpired(token);
    }
}
