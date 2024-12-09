import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { OrderAdminComponent } from './order/order.admin.component';
import { DetailOrderAdminComponent } from './detail-order/detail.order.admin.component';
import { ProductAdminComponent } from './product/product.admin.component';
import { CategoryAdminComponent } from './category/category.admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticComponent } from './statistic/statistic.component';
import { UserComponent } from './user/user.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AdminComponent,
    OrderAdminComponent,
    DetailOrderAdminComponent,
    ProductAdminComponent,
    CategoryAdminComponent,
    StatisticComponent,
    UserComponent,
  ],
  imports: [
    AdminRoutingModule, // import routes,
    CommonModule,
    FormsModule,
    DragDropModule
  ]
})
export class AdminModule {}