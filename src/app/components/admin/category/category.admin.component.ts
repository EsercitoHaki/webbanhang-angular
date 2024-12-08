import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: ['./category.admin.component.scss'],
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories(1, 10).subscribe((data) => {
      this.categories = data; // Lấy dữ liệu category từ service
    });
  }

  drop(event: CdkDragDrop<Category[]>): void {
    // Sắp xếp lại các category trong danh sách
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }
}
