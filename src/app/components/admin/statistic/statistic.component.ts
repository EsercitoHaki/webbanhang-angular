import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../../services/order.service';  // Giả sử bạn đã có service này
import { Chart, registerables } from 'chart.js';
import { OrderResponse } from '../../../responses/order/order.response';

Chart.register(...registerables); // Đăng ký các module của Chart.js

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  @ViewChild('salesChart') salesChart!: ElementRef; // Thêm dấu '!' để TypeScript biết rằng salesChart sẽ được gán giá trị

  salesData: any = [];
  topProducts: { name: string; quantity: number }[] = []; // Lưu trữ top 5 sản phẩm

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getSalesData(); // Lấy dữ liệu doanh thu
  }

  getSalesData(): void {
    const currentYear = new Date().getFullYear();
    this.orderService.getAllOrders('', 0, 12).subscribe({
      next: (response: any) => {
        if (response && response.orders) {
          const orders: OrderResponse[] = response.orders;
          const sales = new Array(12).fill(0);
          const productMap = new Map<string, number>(); // Bản đồ lưu trữ số lượng sản phẩm
  
          orders.forEach((order: OrderResponse) => {
            const orderDate = new Date(order.order_date);
            if (orderDate.getFullYear() === currentYear) {
              const month = orderDate.getMonth();
              sales[month] += order.total_money;

              // Kiểm tra và log order_details
              console.log('Order Details:', order.order_details);
              order.order_details.forEach((detail) => {
                const productName = detail.product.name;
                let quantity = detail.number_of_products; // Use 'numberOfProducts' as in the DetailOrderAdminComponent
  
                // Ensure quantity is a valid number, or treat it as 0 if not
                if (!quantity || isNaN(quantity)) {
                  console.warn(`Invalid or missing quantity for product: ${productName}`);
                  quantity = 0; // Default to 0 if quantity is missing or invalid
                }
  
                // Sum the quantities per product
                productMap.set(
                  productName,
                  (productMap.get(productName) || 0) + quantity
                );
              });
            }
          });
  
          // Sắp xếp và lấy top 5 sản phẩm bán chạy nhất
          this.topProducts = Array.from(productMap.entries())
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
  
          this.salesData = sales;
          this.createSalesChart();
        } else {
          console.error('No orders found in response.');
        }
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      },
    });
  }

  createSalesChart(): void {
    const ctx = this.salesChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line', // Chọn loại biểu đồ là line
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
          {
            label: 'Doanh thu (VND)',
            data: this.salesData,
            borderColor: '#4CAF50',
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
