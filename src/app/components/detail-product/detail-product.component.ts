import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../services/order.service';
import { OrderDetail } from '../../models/order.detail';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';


@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})

export class DetailProductComponent implements OnInit {
  recommendedProducts: Product[] = [];
  commentProducts: Comment[] = [];
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    // private categoryService: CategoryService,
    // private router: Router,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }
  ngOnInit() {
    // Lấy productId từ URL      
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger
    //this.cartService.clearCart();
    //const idParam = 9 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger
          this.product = response
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);

          this.getRecommendedProducts(this.productId);
          this.getCommentsByProduct(this.productId);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        }
      });

    } else {
      console.error('Invalid productId:', idParam);
    }
  }
  getRecommendedProducts(productId: number) {
    this.productService.getRecommenderProduct(productId).subscribe({
      next: (response: any) => {
        this.recommendedProducts = response;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }
  getCommentsByProduct(productId: number) {
    this.commentService.getCommentsByProduct(productId).subscribe({
      next: (response: any) => {
        // Chuyển dữ liệu thành đối tượng comment với replies nguyên vẹn
        const comments = response.map((comment: any) => {
          const createdAt = new Date(
            comment.updated_at[0],
            comment.updated_at[1] - 1,
            comment.updated_at[2],
            comment.updated_at[3],
            comment.updated_at[4],
            comment.updated_at[5]
          );
          return {
            ...comment,
            created_at: createdAt
          };
        });

        // Không cần gán lại replies, vì API đã trả về đúng cấu trúc
        this.commentProducts = comments;  // Dữ liệu đã đầy đủ
      },
      error: (error: any) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    debugger
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      this.router.navigate(['/orders']);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    this.router.navigate(['/orders']);
  }
}