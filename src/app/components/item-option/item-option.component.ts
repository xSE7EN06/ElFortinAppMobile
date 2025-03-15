import { Component, Input, OnInit } from '@angular/core';
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
  count = 0;

  constructor(private alertController: AlertController, private productService: ProductService) { }

  ngOnInit() {}

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  async removeFromCart(item: Producto) {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de que deseas eliminar ${item.name} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.productService.toggleCart(item);
          }
        }
      ]
    });

    await alert.present();
  }

}
