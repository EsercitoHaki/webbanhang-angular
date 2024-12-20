import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../../../services/user.service';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderDetail } from '../../../models/order.detail';
import VanillaTilt from 'vanilla-tilt';
Chart.register(...registerables);

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  @ViewChild('salesChart') salesChart!: ElementRef;
  @ViewChild('topProductsChart') topProductsChart!: ElementRef;

  salesData: any = [];
  topProductsData: any = [];

  totalSales: number = 0;
  totalOrders: number = 0;
  totalAccounts: number = 0;

  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit(): void {
    this.getSalesData();
    this.getTopSellingProducts();
    this.getTotalSalesAndOrders();
    this.getTotalAccounts();
  }

  getTotalAccounts(): void {
    this.userService.countUsersByRole(1).subscribe({
      next: (count: number) => {
        this.totalAccounts = count;
      },
      error: (err) => {
        console.error('Error fetching total accounts:', err);
      },
    });
  }
  

  getSalesData(): void {
    const currentYear = new Date().getFullYear();
    const yearsToFetch = [currentYear, currentYear - 1, currentYear - 2];
    const salesDataByYear: { [key: number]: number[] } = {};
  
    yearsToFetch.forEach(year => salesDataByYear[year] = new Array(12).fill(0));
  
    this.orderService.getAllOrders('', 0, 12).subscribe({
      next: (response: any) => {
        if (response && response.orders) {
          const orders: OrderResponse[] = response.orders;
  
          orders.forEach((order: OrderResponse) => {
            const orderDate = new Date(order.order_date);
            const year = orderDate.getFullYear();
            if (yearsToFetch.includes(year)) {
              const month = orderDate.getMonth();
              salesDataByYear[year][month] += order.total_money;
            }
          });
  
          this.salesData = salesDataByYear;
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
  

  getTopSellingProducts(): void {
    this.orderService.getAllOrders('', 0, 1000).subscribe({
      next: (response: any) => {
  
        if (response && response.orders) {
          const orders: OrderResponse[] = response.orders;
  
          const productSales: { [key: string]: number } = {};
  
          orders.forEach((order: OrderResponse) => {
  
            if (order.order_details && order.order_details.length > 0) {
order.order_details.forEach((detail: any) => {
  
                // Normalize field names
                const numberOfProducts = detail.numberOfProducts;
  
                if (detail.product && detail.product.name) {
                  const productName = detail.product.name;
                  productSales[productName] = (productSales[productName] || 0) + numberOfProducts;
                }
              });
            }
          });
  
          // Convert productSales to an array and sort
          const topProductsArray = Object.entries(productSales)
            .map(([name, totalAmount]) => ({ name, totalAmount }))
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 5);
  
          this.topProductsData = topProductsArray;
          this.createTopProductsChart();
        } else {
          console.error('No orders found in response.');
        }
      },
      error: (err) => {
        console.error('Error fetching top selling products:', err);
      },
    });
  }
  

  createSalesChart(): void {
    const ctx = this.salesChart.nativeElement.getContext('2d');
    const datasets: { label: string; data: number[]; borderColor: string; fill: boolean; tension: number }[] = [];
    const colors = ['#fa2a55', '#2a9df4', '#34c759']; // Màu sắc cho từng năm
  
    Object.keys(this.salesData).forEach((year, index) => {
      datasets.push({
        label: `Doanh thu ${year}`,
        data: this.salesData[year],
        borderColor: colors[index],
        fill: false,
        tension: 0.1
      });
    });
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: datasets
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
  
  

  createTopProductsChart(): void {
    const labels = this.topProductsData.map((product: any) => 
      `${product.name} (${product.totalAmount})`
    );
    const data = this.topProductsData.map((product: any) => product.totalAmount);
  
    const ctx = this.topProductsChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Số lượng bán được',
            data: data,
            backgroundColor: '#E5432D',
            borderColor: '#E5432D',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Số lượng: ${context.formattedValue}`;
              }
            }
          }
        }
      }
    });
  }
getTotalSalesAndOrders(): void {
    this.orderService.getAllOrders('', 0, 1000).subscribe({
      next: (response: any) => {
        if (response && response.orders) {
          const orders: OrderResponse[] = response.orders;
          this.totalOrders = orders.length;
          this.totalSales = orders.reduce((sum, order) => sum + order.total_money, 0);
        } else {
          console.error('No orders found in response.');
        }
      },
      error: (err) => {
        console.error('Error fetching total sales and orders:', err);
      },
    });
  }
}