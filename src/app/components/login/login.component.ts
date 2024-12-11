import { Component, ViewChild } from '@angular/core';
declare var google: any;

import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponse } from '../../responses/user/login.response';
import { Role } from '../../models/role'; // Đường dẫn đến model Role
import { UserResponse } from '../../responses/user/user.response';


import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '0702050435';
  password: string = '123';
  showPassword: boolean = false;

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse;

  user!: SocialUser;
  loggedIn: boolean = false;


  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private authService: SocialAuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => { // Sử dụng kiểu Role[]
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
    
  }


  googleSignInSuccess: boolean = false;
  googleSignInError: boolean = false;

  // Hàm nhận token từ Google Sign-In và gửi lên backend
  onGoogleSignIn(token: string) {
  console.log('Google Sign-In Token:', token);

  this.userService.loginGoogle(token).subscribe({
    next: (response: any) => {
      console.log('Đăng nhập thành công hoặc tài khoản mới đã được tạo:', response);
      debugger
      this.googleSignInSuccess = true;
      this.googleSignInError = false;

      // Kiểm tra token trong response
      if (!response.token) {
        console.error('Response không chứa token');
        this.googleSignInError = true;
        return;
      }

      // Lưu Google token
      this.tokenService.setToken(response.token, 'googleAuthToken');
      debugger

      // Kiểm tra token có hết hạn không
      if (this.tokenService.isTokenExpired('googleAuthToken')) {
        console.error('Token Google đã hết hạn');
        this.googleSignInError = true;
        this.googleSignInSuccess = false;
        return;
      }

      localStorage.removeItem('googleAuthToken'); 
      // Chuyển hướng sau khi đăng nhập thành công
      this.router.navigate(['/']);
    },
    error: (error) => {
      console.error('Lỗi khi đăng nhập với Google:', error);
      this.googleSignInError = true;
      this.googleSignInSuccess = false;
    }
  });
}

  

  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }


  // login() {
  //   const message = `phone: ${this.phoneNumber}` +
  //     `password: ${this.password}`;
  //   //alert(message);
  //   debugger

  //   const loginDTO: LoginDTO = {
  //     phone_number: this.phoneNumber,
  //     password: this.password,
  //     role_id: this.selectedRole?.id ?? 1
  //   };
  //   this.userService.login(loginDTO).subscribe({
  //     next: (response: LoginResponse) => {
  //       debugger;
  //       const { token } = response;
  //       if (this.rememberMe) {
  //         this.tokenService.setToken(token);
  //         debugger;
  //         this.userService.getUserDetail(token).subscribe({
  //           next: (response: any) => {
  //             debugger
  //             this.userResponse = {
  //               ...response,
  //               date_of_birth: new Date(response.date_of_birth),
  //             };
  //             // localStorage.setItem('userResponse', JSON.stringify(this.userResponse));
  //             this.userService.saveUserResponseToLocalStorage(this.userResponse);
  //             if (this.userResponse?.role.name == 'admin') {
  //               this.router.navigate(['/admin']);
  //             } else if (this.userResponse?.role.name == 'user') {
  //               this.router.navigate(['/']);
  //             }

  //           },
  //           complete: () => {
  //             debugger;
  //           },
  //           error: (error: any) => {
  //             debugger;
  //             alert(error.error.message);
  //           }
  //         })
  //       }
  //     },
  //     complete: () => {
  //       debugger;
  //     },
  //     error: (error: any) => {
  //       debugger;
  //       alert(error.error.message);
  //     }
  //   });
  // }
  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
  
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        this.handleLoginSuccess(response);
        debugger
      },
      error: (error: any) => {
        console.error('Lỗi đăng nhập:', error);
        alert(error.error.message);
      }
    });
  }
  
  private handleLoginSuccess(response: LoginResponse): void {
    const { token } = response;
  
    // Nếu người dùng đăng nhập thường, xóa token Google (nếu có)
    localStorage.removeItem('googleAuthToken');  // Xóa token Google trước khi lưu token đăng nhập thường
  
    if (this.rememberMe) {
      this.tokenService.setToken(token, 'authToken');  // Lưu token đăng nhập thường
    }
  
    this.userService.getUserDetail(token).subscribe({
      next: (response: any) => {
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };
  
        this.userService.saveUserResponseToLocalStorage(this.userResponse!);
        this.redirectUser();
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        alert(error.error.message);
      }
    });
  }
  
  private redirectUser(): void {
    // Đảm bảo rằng role tồn tại và có giá trị
    if (this.userResponse?.role?.name === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
