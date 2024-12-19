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
import { CommentDTO } from '../../dtos/comment.dto';
import { TokenService } from '../../services/token.service';


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
  newCommentContent: string = '';
  replyContent: { [commentId: number]: string } = {};
  replyToCommentId: number | null = null;
  activeReplyCommentId: number | null = null; // Biến lưu id của comment đang được trả lời

  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    // private categoryService: CategoryService,
    // private router: Router,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
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
        debugger
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
            created_at: createdAt,
            id: comment.id
          };
        });

        this.commentProducts = comments;
        debugger
      },
      error: (error: any) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

  postComment(): void {
    const userId = this.tokenService.getUserId();
    const token = this.tokenService.getToken();

    if (!userId || !token) {
      console.error('Không tìm thấy userId hoặc token');
      return;
    }
    debugger
    if(this.newCommentContent.trim() === '') {
      console.error('Bình luận không thể để trống');
      return;
    }

    const commentDTO: CommentDTO = {
      content: this.newCommentContent,
      product_id: this.productId,
      user_id: userId,
      parent_id: null
    };

    this.commentService.addComment(commentDTO).subscribe({
      next: () => {
        debugger
        this.newCommentContent = '';
        this.getCommentsByProduct(this.productId);
      },
      error: (error: any) => {
        debugger
        console.error('Error adding comment:', error);
      }
    });
  }
  
  toggleReply(commentId: number): void {
    // Bật/tắt textarea cho comment tương ứng
    if (this.activeReplyCommentId === commentId) {
      this.activeReplyCommentId = null; // Ẩn nếu đã mở
    } else {
      this.activeReplyCommentId = commentId; // Hiện textarea cho comment hiện tại
    }
  }
  

  postReply(commentId: number): void {
    const replyContent = this.replyContent[commentId];
    const userId = this.tokenService.getUserId();
  
    // Kiểm tra nội dung reply
    if (!replyContent || replyContent.trim() === '') {
      console.error('Nội dung comment không được để trống');
      return;
    }
  
    // Kiểm tra commentId
    if (commentId === null) {
      console.error('Không có comment con nào để trả lời');
      return;
    }
  
    // Tạo DTO để gửi
    const replyDTO: CommentDTO = {
      content: replyContent,
      product_id: this.productId,
      user_id: userId,
      parent_id: commentId
    };
  
    // Gọi service để gửi reply
    this.commentService.replyToComment(commentId, replyDTO).subscribe({
      next: () => {
        this.replyContent[commentId] = ''; // Xóa nội dung reply
        this.replyToCommentId = null; // Quay về trạng thái ban đầu (ẩn ô nhập liệu)
        this.getCommentsByProduct(this.productId); // Tải lại danh sách comment
      },
      error: (error: any) => {
        console.error('Error adding reply:', error);
      }
    });
  }
  
  
  getCommentId(comment: Comment): number {
    return comment.id;
  }

  replyToCommentClick(commentId: number): void {
    this.replyToCommentId = commentId;
    debugger
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
  onProductClick(productId: number): void {
    this.router.navigate(['/products', productId]).then(() => {
      this.productId = productId;
      this.ngOnInit();
    });
  }
}