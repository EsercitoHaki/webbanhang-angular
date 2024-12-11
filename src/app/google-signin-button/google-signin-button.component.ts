import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare var google: any;  // Khai báo google object để sử dụng Google API

@Component({
  selector: 'app-google-signin-button',
  templateUrl: './google-signin-button.component.html',
  styleUrls: ['./google-signin-button.component.scss']
})
export class GoogleSigninButtonComponent implements OnInit {
  @Output() signInSuccess = new EventEmitter<string>();  // EventEmitter để truyền token cho parent component

  constructor() { }

  ngOnInit(): void {
    if (typeof window.google !== 'undefined' && window.google.accounts) {
      this.renderGoogleSignInButton();
    } else {
      console.error('Google Sign-In API not loaded');
    }
    this.renderGoogleSignInButton();
  }

  renderGoogleSignInButton() {
    // Khởi tạo Google Sign-In với Client ID của bạn
    window.google.accounts.id.initialize({
      client_id: '300458157401-lhpsaqtp4370qlo88gu8a9v8j8ia5pgc.apps.googleusercontent.com',  // Thay bằng Client ID của bạn
      callback: this.handleCredentialResponse.bind(this),
    });

    // Hiển thị nút đăng nhập Google
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' } // Tùy chỉnh kiểu nút
    );
  }

  // Xử lý thông tin đăng nhập trả về từ Google
  handleCredentialResponse(response: any) {
    const idToken = response.credential;
    console.log('ID Token:', idToken);
    debugger
    
    // Emit token lên parent component
    this.signInSuccess.emit(idToken);
  }
}
