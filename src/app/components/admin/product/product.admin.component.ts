import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { ProductImage } from '../../../models/product.image';

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
  categories: Category[] = []; // Danh sách các danh mục
  selectedProductImages: any[] = []; // Lưu trữ ảnh của sản phẩm đã chọn
  popupVisible: boolean = false; // Trạng thái hiển thị popup
  popupPosition = { x: 0, y: 0 }; // Vị trí popup
  selectedFiles: File[] = []; // Lưu trữ danh sách tệp đã chọn
  selectedProductId: number | null = null; // Thêm thuộc tính này trong class ProductAdminComponent

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService // Inject CategoryService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories(); // Lấy danh sách danh mục
  }

  showPopup(images: any[], productId: number, event: MouseEvent) {
    const baseUrl = 'http://localhost:8088/api/v1/products/images/';
    this.selectedProductImages = images.map(image => ({
      url: image.image_url.startsWith('http') ? image.image_url : `${baseUrl}${image.image_url}`
    }));
    this.selectedProductId = productId; // Lưu productId hiện tại
    this.popupPosition = { x: event.clientX, y: event.clientY };
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // Lưu danh sách các tệp được chọn
      this.uploadImages(); // Gọi phương thức upload
    }
  }
  
  // uploadImages() {
  //   if (!this.selectedFiles.length) {
  //     alert('Vui lòng chọn ít nhất một tệp.');
  //     return;
  //   }
  
  //   if (!this.selectedProductId) {
  //     alert('Không xác định được sản phẩm để tải lên hình ảnh.');
  //     return;
  //   }
  
  //   this.productService.uploadImages(this.selectedProductId, this.selectedFiles).subscribe({
  //     next: (response) => {
  //       alert('Tải lên ảnh thành công!');
  //       this.selectedProductImages.push(
  //         ...response.map((image: { image_url: string }) => ({
  //           url: image.image_url.startsWith('http')
  //             ? image.image_url
  //             : `http://localhost:8088/api/v1/products/images/${image.image_url}`
  //         }))
  //       );
  //       this.selectedFiles = []; // Xóa danh sách tệp đã chọn sau khi tải lên
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi tải lên ảnh:', error);
  //       alert('Đã xảy ra lỗi khi tải lên ảnh.');
  //     }
  //   });
  // }

  uploadImages() {
    if (!this.selectedFiles.length) {
      alert('Vui lòng chọn ít nhất một tệp.');
      return;
    }
  
    if (!this.selectedProductId) {
      alert('Không xác định được sản phẩm để tải lên hình ảnh.');
      return;
    }
  
    this.productService.uploadImages(this.selectedProductId, this.selectedFiles).subscribe({
      next: (response) => {
        alert('Tải lên ảnh thành công!');
        this.selectedProductImages.push(
          ...response.map((image: { image_url: string, id: number }) => ({
            url: image.image_url.startsWith('http')
              ? image.image_url
              : `http://localhost:8088/api/v1/products/images/${image.image_url}`,
            id: image.id // Assuming the response includes the image ID
          }))
        );
        this.selectedFiles = []; // Clear the selected files after upload
      },
      error: (error) => {
        console.error('Lỗi khi tải lên ảnh:', error);
        alert('Đã xảy ra lỗi khi tải lên ảnh.');
      }
    });
  }
  
  
  // deleteImage(image: any) {
  //   const confirmation = window.confirm('Are you sure you want to delete this image?');
  //   if (confirmation) {
  //     const imageUrl = image.url;  // Get the image URL
  
  //     this.productService.deleteImage(this.selectedProductId!, imageUrl).subscribe({
  //       next: () => {
  //         // Remove the image from the selectedProductImages list
  //         this.selectedProductImages = this.selectedProductImages.filter(img => img.url !== imageUrl);
  //         alert('Image deleted successfully');
  //       },
  //       error: (error) => {
  //         console.error('Error deleting image:', error);
  //         alert('There was an error deleting the image.');
  //       }
  //     });
  //   }
  // }
  deleteImage(image: any) {
    const confirmation = window.confirm('Are you sure you want to delete this image?');
    if (confirmation) {
      const imageId = image.id;  // Assuming image object has an 'id' field
      this.productService.deleteImage(this.selectedProductId!, imageId).subscribe({
        next: () => {
          // Remove the image from the selectedProductImages list by id
          this.selectedProductImages = this.selectedProductImages.filter(img => img.id !== imageId);
          alert('Image deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          alert('There was an error deleting the image.');
        }
      });
    }
  }
  
  
  

  getAllProducts() {
    this.productService.getProducts('', 0, this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.products = response.products;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }  

  getAllCategories() {
    this.categoryService.getCategories(1, 100).subscribe({ // Giả sử tối đa 100 danh mục
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không xác định';
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    console.log('Current Page:', this.currentPage);  // Debugging line
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
        this.toggleMenu(response);
        alert('Product updated successfully');
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
        alert('Product added successfully');
        this.getAllProducts();  // Tải lại sản phẩm sau khi thêm mới
      },
      error: (error) => {
        console.error('Error adding product:', error);
      }
    });
  }
}