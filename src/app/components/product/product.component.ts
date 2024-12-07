import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewChecked {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";

  private isVanillaTiltInitialized: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }

  ngAfterViewChecked(): void {
    if (!this.isVanillaTiltInitialized && this.products.length > 0) {
      this.initializeVanillaTilt();
    }
  }

  private initializeVanillaTilt(): void {
    const productItems = document.querySelectorAll('.product-item');
    if (productItems.length > 0) {
      VanillaTilt.init(productItems as any);
      this.isVanillaTiltInitialized = true;
    }
  }

  getCategories(page: number, limit: number): void {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  searchProducts(): void {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number): void {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);

        // Đặt lại trạng thái để `VanillaTilt` khởi tạo lại khi dữ liệu thay đổi
        this.isVanillaTiltInitialized = false;
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  onProductClick(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
