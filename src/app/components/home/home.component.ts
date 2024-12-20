import { Product } from './../../models/product';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';  // Import Router for navigation
import VanillaTilt from 'vanilla-tilt';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  newProducts: { id: number; name: string; price: number; thumbnail: string }[] = [];
  private isVanillaTiltInitialized: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.getNewProducts('', 0, 0, 12);
  }

  getNewProducts(keyword: string, selectedCategoryId: number, page: number, limit: number): void {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);

        this.newProducts = response.products.map((product: Product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: `${environment.apiBaseUrl}/products/images/${product.thumbnail}`
        }));
        console.log('Mapped New Products:', this.newProducts);
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isVanillaTiltInitialized && this.newProducts.length > 0) {
      this.initializeVanillaTilt();
    }
  }

  private initializeVanillaTilt(): void {
    const productItems = document.querySelectorAll('.chu');
    if (productItems.length > 0) {
      VanillaTilt.init(productItems as any);
      this.isVanillaTiltInitialized = true;
    }
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/products', productId], { replaceUrl: true }).then(() => {
      window.scrollTo(0, 0); 
    });
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/products'], {
      queryParams: { categoryId: categoryId }
    });
  }
  
  navigateToLaptop(): void {
    this.navigateToCategory(2);
  }
  
  navigateToAccessories(): void {
    this.navigateToCategory(5); 
  }
  
  navigateToWatches(): void {
    this.navigateToCategory(4); 
  }
  
  navigateToTvs(): void {
    this.navigateToCategory(6); 
  }
  
  navigateToHomeAppliances(): void {
    this.navigateToCategory(7); 
  }
  
  
}