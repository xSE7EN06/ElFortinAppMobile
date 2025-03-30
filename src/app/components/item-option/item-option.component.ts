import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/productos.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-item-option',
  templateUrl: './item-option.component.html',
  styleUrls: ['./item-option.component.scss'],
  standalone: false
})
export class ItemOptionComponent  implements OnInit {

  @Input() cartProdut: Producto[] = [];
  @Output() confirmRemove = new EventEmitter<Producto>();
  @Output() countMap = new Map<number, number>();

  constructor(private alertController: AlertController, public productService: ProductService, private ngZone: NgZone) { }

  ngOnInit() {
     // Inicializar los productos con cantidad 1 si no están en el mapa
     this.cartProdut.forEach(producto => {
      if (!this.countMap.has(producto.id)) {
        this.countMap.set(producto.id, 1);
      }
    });
  }

  // Incrementar la cantidad del producto
  increment(item: Producto) {
    const current = this.productService.getCantidad(item.id);
    this.productService.setCantidad(item.id, current + 1);
  }

 // Decrementar la cantidad del producto
 decrement(item: Producto) {
  const current = this.productService.getCantidad(item.id);
  if (current > 1) {
    this.productService.setCantidad(item.id, current - 1);
  } else {
    this.requestRemove(item);
  }
}


requestRemove(item: Producto) {
  this.confirmRemove.emit(item); // Emitimos el producto al componente padre
}

}
