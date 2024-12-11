import { Product } from './../../models/product';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';  // Import Router for navigation
import VanillaTilt from 'vanilla-tilt';
import { ProductResponse } from './../../responses/product/product.response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  products: any[] = [];
  private isVanillaTiltInitialized: boolean = false;

  constructor(
    private productService: ProductService,  // Đảm bảo sử dụng productService
    private router: Router  // Inject Router into the constructor
  ) {}

  ngOnInit(): void {
    this.getNewProducts('', 0, 0, 10);
  }

  getNewProducts(keyword: string, categoryId: number, page: number, limit: number): void {
    this.productService.getNewProducts(keyword, categoryId, page, limit).subscribe(
      (response) => {
        console.log('API response home:', response);
        const products = response.products;
  
        // Ensure that products is an array and map it to ProductResponse
        if (Array.isArray(products)) {
          // Map the API response to ProductResponse format
          this.products = products.map(product => ({
            product_name: product.name,  // Assuming the API provides 'name'
            thumbnail: product.thumbnail, // Assuming the API provides 'thumbnail'
            price: product.price,         // Assuming the API provides 'price'
          })) as ProductResponse[];
  
          // Debugging the mapped products
          debugger;
        } else {
          console.error('API response does not contain valid products array:', products);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  
  ngAfterViewChecked(): void {
    if (!this.isVanillaTiltInitialized && this.products.length > 0) {
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

  // Method to navigate to the /products route when the button is clicked
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
