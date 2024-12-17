import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: ['./category.admin.component.scss'],
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = [];
  editingIndex: number | null = null;
  showCreateCategoryPopup = false;
  newCategoryName = '';

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

  startEditing(index: number): void {
    this.editingIndex = index;
  }

  updateCategory(index: number): void {
  const category = this.categories[index];
  if (category) {
    this.categoryService.updateCategory(category.id, category).subscribe({
      next: () => {
        this.categories[index] = { ...category }; // Cập nhật trực tiếp danh sách hiện tại
        this.editingIndex = null; // Thoát chế độ chỉnh sửa
      },
      error: (err) => {
        console.error('Failed to update category', err);
      },
    });
  }
}

  
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



  // Open popup for creating category
  openCreateCategoryPopup(): void {
    this.showCreateCategoryPopup = true;
  }

  // Close popup
  closePopup(event: MouseEvent): void {
    this.showCreateCategoryPopup = false;
    this.newCategoryName = ''; // Reset the new category name when closing
  }

  // Cancel creating category
  cancelCreateCategory(): void {
    this.showCreateCategoryPopup = false;
    this.newCategoryName = '';
  }

  // Add a new category
  addCategory(): void {
    if (this.newCategoryName.trim()) {
      const isDuplicate = this.categories.some(
        (category) =>
          category.name.toLowerCase() === this.newCategoryName.trim().toLowerCase()
      );
  
      if (isDuplicate) {
        alert('Category name already exists');
        return;
      }
  
      const newCategory: Category = {
        id: 0, // Backend sẽ tạo ID
        name: this.newCategoryName,
      };
  
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.getCategories(); // Gọi lại hàm để cập nhật danh sách
          this.cancelCreateCategory();
        },
        error: (err) => {
          console.error('Failed to create category', err);
        },
      });
    }
  }
  
  
}
