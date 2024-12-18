import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../responses/user/user.response';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: UserResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers(this.currentPage, this.itemsPerPage);
  }

  getRole(user: UserResponse): string {
    return user.role ? user.role.name : 'No Role';  // Hoặc một giá trị mặc định khác
  }  

  getAllUsers(page: number, limit: number) {
    this.userService.getAllUsers(page - 1, limit).subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  blockOrEnable(userId: number, isActive: boolean): void {
    const newStatus = isActive ? false : true;  // Thay đổi trạng thái người dùng
    
    this.userService.blockOrEnable(userId, newStatus).subscribe({
      next: () => {
        // Cập nhật trạng thái người dùng trong UI sau khi API trả về
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.is_active = newStatus;  // Đổi trạng thái người dùng trong mảng
        }
      },
      error: (err) => {
        console.error('Error updating user status', err);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getAllUsers(this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
}
