import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/order/orders.service';
import { Ordenes } from '../interfaces/ordenes';
import { UsuarioService } from '../services/user.service';

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
  ordersCanceled: Ordenes[] = [];

  selectedSegment: string = 'orderInited';

  constructor(private ordersService: OrdersService, private userService: UsuarioService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe((ordenes) => {
      this.orders = ordenes;
      const id = this.userService.getUserIdFormToken();
      const userId: string = id !== undefined && id !== null ? id.toString() : '';

      // Filtrar las órdenes según su estado
      this.ordersInProgress = this.orders.filter(order => order.status === 'Pendiente' && order.client_id === userId);
      this.ordersCompleted = this.orders.filter(order => order.status === 'Entregado' && order.client_id === userId);
      this.ordersCanceled = this.orders.filter(order => order.status === 'Cancelado' && order.client_id === userId)
    });
  }

}
