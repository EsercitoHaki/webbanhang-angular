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
  editingIndex: number | null = null;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories(1, 10).subscribe((data) => {
      this.categories = data;
    });
  }

  // Xử lý sự kiện kéo thả
  drop(event: CdkDragDrop<Category[]>): void {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  // Xử lý bắt đầu sửa
  startEditing(index: number): void {
    this.editingIndex = index;
  }

  // Xử lý cập nhật category
  updateCategory(index: number): void {
    const category = this.categories[index];
    if (category) {
      this.categoryService.updateCategory(category.id, category).subscribe({
        next: () => {
          this.editingIndex = null;
        },
        error: (err) => {
          console.error('Failed to update category', err);
        },
      });
    }
  }

  // Xử lý xoá category
  deleteCategory(id: number, index: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories.splice(index, 1);
        },
        error: (err) => {
          console.error('Failed to delete category', err);
        },
      });
    }
  }
}

