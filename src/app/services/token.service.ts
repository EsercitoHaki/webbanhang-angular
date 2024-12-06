import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
    private readonly TOKEN_KEY = 'auth_token';
    private jwtHelperService = new JwtHelperService();
    constructor(){}
    //getter/setter
    getToken():string {
        return localStorage.getItem(this.TOKEN_KEY) ?? '';
    }
    setToken(token: string): void {        
        localStorage.setItem(this.TOKEN_KEY, token);             
    }
    // getUserId(): number {
    //     let userObject = this.jwtHelperService.decodeToken(this.getToken() ?? '');
    //     return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
    // }

    getUserId(): number {
        const token = this.getToken();
        if (!token) {
            return 0; // Hoặc null tùy theo yêu cầu logic
        }
    
        try {
            const userObject = this.jwtHelperService.decodeToken(token);
            return userObject && 'userId' in userObject ? parseInt(userObject['userId']) : 0;
        } catch (error) {
            console.error('Invalid token:', error);
            return 0; // Hoặc null nếu token không hợp lệ
        }
    }
    
      
    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }              
    // isTokenExpired(): boolean { 
    //     if(this.getToken() == null) {
    //         return false;
    //     }       
    //     return this.jwtHelperService.isTokenExpired(this.getToken()!);
    // }

    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) {
            return true; // Nếu không có token, coi như đã hết hạn
        }
        return this.jwtHelperService.isTokenExpired(token);
    }
    
}
