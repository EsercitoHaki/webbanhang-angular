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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getSalesData(); // Lấy dữ liệu doanh thu
  }

  getSalesData(): void {
    const currentYear = new Date().getFullYear();
    this.orderService.getAllOrders('', 1, 100).subscribe({
      next: (orders: OrderResponse[]) => {
        const sales = new Array(12).fill(0); // Mảng doanh thu theo từng tháng
  
        orders.forEach((order: OrderResponse) => {
          const orderDate = new Date(order.order_date);
          if (orderDate.getFullYear() === currentYear) {
            const month = orderDate.getMonth(); // Lấy tháng
            sales[month] += order.total_money; // Cộng dồn doanh thu
          }
        });
  
        this.salesData = sales;
        this.createSalesChart(); // Tạo biểu đồ
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
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
