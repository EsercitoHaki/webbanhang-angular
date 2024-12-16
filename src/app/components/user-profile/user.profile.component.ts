
import { Component, ViewChild, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  ValidationErrors, 
  ValidatorFn, 
  AbstractControl
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../responses/order/order.response';
@Component({
  selector: 'user-profile',
  templateUrl: './user.profile.component.html',
  styleUrls: ['./user.profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse;
  user: Partial<UserResponse> = {};
  orders: OrderResponse[] = [];
  token:string = '';
  menuState: { [key: number]: boolean } = {};

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private orderService: OrderService,
  ){        
    
  }
  
  ngOnInit(): void {  
    debugger
    this.token = this.tokenService.getToken();
    const userId = this.tokenService.getUserId();
    this.loadOrderHistory(userId);
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        debugger
        this.user = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };         
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

  loadOrderHistory(userId: number){
    this.orderService.getOrderHistoryByUserId(userId).subscribe({
      next: (response: any) => {
        this.orders = response;
        debugger // Gán vào biến để hiển thị
      },
      complete: () => {
        debugger;
      },
      error: (err: any) => {
        console.error('Error loading order history:', err);
      }
    });
  }

  toggleMenu(order: OrderResponse) {
    this.menuState[order.id] = !this.menuState[order.id];
  }

  viewDetails(order:OrderResponse) {
    debugger
    this.router.navigate(['order-information/', order.id]);
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/edit-user-profile']);
  }
}
