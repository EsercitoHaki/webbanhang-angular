import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user/user.response';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isDropdownOpen: boolean = false;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }

  toggleDropdown(): void {
    // Tắt dropdown nếu đang mở, hoặc mở nếu đang đóng
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.cartService.clearCart();
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();    
    this.router.navigate(['/']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/user-profile']);
  }
}
