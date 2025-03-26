import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/order/orders.service';
import { Ordenes } from '../interfaces/ordenes';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false
})
export class OrdersPage implements OnInit {
  orders: Ordenes[] = [];
  ordersInProgress: Ordenes[] = [];
  ordersCompleted: Ordenes[] = [];

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(): void{
    this.ordersService.getOrders().subscribe((ordenes) => {
      this.orders = ordenes;

      // Filtrar las órdenes según su estado
      this.ordersInProgress = this.orders.filter(order => order.status_id === '1');
      this.ordersCompleted = this.orders.filter(order => order.status_id === '4');
    });
  }

}
