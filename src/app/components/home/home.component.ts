import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';  // Import Router for navigation
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  products: any[] = [];
  private isVanillaTiltInitialized: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router  // Inject Router into the constructor
  ) {}

  ngOnInit(): void {
    // Initialization logic can go here if needed
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
