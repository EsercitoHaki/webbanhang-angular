import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: ['./product.admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 1;  // Trang hiện tại
  itemsPerPage: number = 10;  // Số sản phẩm mỗi trang
  totalPages: number = 0;  // Tổng số trang
  menuState: { [key: number]: boolean } = {};
  showAddProductDialog: boolean = false;
  newProduct: Product = {} as Product;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getProducts('', 0, this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.products = response.products;
        this.totalPages = response.totalPages;  // Cập nhật tổng số trang từ API
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.getAllProducts();  // Tải lại sản phẩm khi trang thay đổi
  }

  toggleMenu(product: Product) {
    // Thay đổi trạng thái của menu đối với sản phẩm đó
    this.menuState[product.id] = !this.menuState[product.id];
  }

  saveProduct(product: Product) {
    // Đây là phương thức được gọi khi người dùng chỉnh sửa dữ liệu trong bảng
    // Bạn có thể gọi API để lưu dữ liệu hoặc chỉ cập nhật tạm thời
    console.log('Product saved:', product);
  }

  updateProduct(product: Product) {
    // Gửi yêu cầu cập nhật sản phẩm lên server
    this.productService.updateProduct(product).subscribe({
      next: (response) => {
        console.log('Product updated successfully');
        // Cập nhật thời gian updated_at hoặc thực hiện các thao tác sau khi thành công
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }

  deleteProduct(productId: number) {
    const confirmation = window.confirm('Are you sure you want to delete this product?');
    if (confirmation) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.getAllProducts(); // Reload products after deletion
          console.log('Product deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  generateVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  
    let startPage = Math.max(this.currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, this.totalPages);
  
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
  
    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  } 

  openAddProductDialog() {
    this.showAddProductDialog = true;
  }

  closeAddProductDialog() {
    this.showAddProductDialog = false;
  }

  addProduct() {
    this.productService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        this.products.push(response);
        this.closeAddProductDialog();
        this.getAllProducts();  // Tải lại sản phẩm sau khi thêm mới
      },
      error: (error) => {
        console.error('Error adding product:', error);
      }
    });
  }
}
