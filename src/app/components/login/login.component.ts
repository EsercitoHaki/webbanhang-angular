/// <reference types="gapi" />
/// <reference types="gapi.auth2" />


import { Component, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponse } from '../../responses/user/login.response';
import { Role } from '../../models/role'; // Đường dẫn đến model Role
import { UserResponse } from '../../responses/user/user.response';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  phoneNumber: string = '33445566';
  password: string = '1234567';

  //
  errorMessage: string | null = null;

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
    
  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        console.error('Failed to fetch roles:', error.message || error);
      },
    });
  
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      if (params['error']) {
        this.errorMessage = 'Đăng nhập thất bại, vui lòng thử lại.';
      }
    });
  
    // Khởi tạo Google Sign-In
    this.initializeGoogleSignIn();
  }
  
  initializeGoogleSignIn() {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: '300458157401-lhpsaqtp4370qlo88gu8a9v8j8ia5pgc.apps.googleusercontent.com', // Thay YOUR_GOOGLE_CLIENT_ID bằng Client ID của bạn
        scope: 'profile email',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:4200',
      });
  
      const googleButton = document.getElementById('google-login-btn');
      auth2.attachClickHandler(googleButton, {}, (googleUser: any) => {
        const idToken = googleUser.getAuthResponse().id_token;
        this.loginWithGoogle(idToken);
      });
    });
  }
  
  loginWithGoogle(idToken: string): void {
    this.userService.googleLogin(idToken).subscribe({
      next: (response: any) => {
        const { token, user } = response;
        // Lưu token vào localStorage
        this.tokenService.setToken(token);
        // Lưu thông tin người dùng
        this.userService.saveUserResponseToLocalStorage(user);
        // Điều hướng đến trang chủ
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Google login failed:', error.message || error);
        this.errorMessage = 'Đăng nhập với Google thất bại. Vui lòng thử lại.';
      }
    });
  }
  
  
  
  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']); 
  }
  login() {
    // Reset thông báo lỗi
    this.errorMessage = null;

    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    //alert(message);
    debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        const { token } = response;
        if (this.rememberMe) {          
          this.tokenService.setToken(token);
          debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };    
              this.userService.saveUserResponseToLocalStorage(this.userResponse); 
              this.router.navigate(['/']);                      
            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              debugger;
              alert(error.error.message);
            }
          })
        }                        
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error.message);
      }
    });
  }

  onGoogleLogin() {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: '300458157401-lhpsaqtp4370qlo88gu8a9v8j8ia5pgc.apps.googleusercontent.com' // Thay bằng Client ID của bạn
      });
  
      auth2.signIn().then((googleUser: gapi.auth2.GoogleUser) => {
        const idToken = googleUser.getAuthResponse().id_token;
        this.loginWithGoogle(idToken);
      }).catch((error: any) => {
        console.error('Google Sign-In error:', error);
        this.errorMessage = 'Đăng nhập với Google thất bại. Vui lòng thử lại.';
      });
    });
  }  
}
