import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProductService, Producto } from '../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false
})
export class CartPage implements OnInit {
  cart: Producto[] = [];

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.productService.getProductos().subscribe((productos) => {
      this.cart = productos; // Load products into cart
    });
  }

  async removeFromCart(item: Producto) {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de que deseas eliminar ${item.title} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
            this.presentToast('Producto eliminado del carrito.');
          }
        }
      ]
    });

    await alert.present();
  }

  async checkout() {
    if (this.cart.length === 0) {
      this.presentToast('El carrito está vacío.', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar compra',
      message: `Total a pagar: $${this.getTotal()}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Pagar',
          handler: () => {
            this.cart = []; // Clear cart after purchase
            this.presentToast('Compra realizada con éxito.', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
