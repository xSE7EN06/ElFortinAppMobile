import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { jsPDF } from 'jspdf';
import { Producto } from '../interfaces/productos.interface';


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

  loadCart(): void{
    this.productService.getProductsCart().subscribe((productos) => {
      this.cart = productos; // Load products into cart
    });
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
            this.generatePDF(); // Call the generate PDF function before clearing the cart
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

  generatePDF() {
    const doc = new jsPDF();

    doc.text('Comprobante de Compra', 10, 10);
    let y = 20; // Variable to manage vertical position for lines

    this.cart.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}, Precio: $${item.price.toFixed(2)}`, 10, y);
      y += 10; // Increment the y position so texts don't overlap
    });

    doc.text(`Total a pagar: $${this.getTotal().toFixed(2)}`, 10, y + 10);
    doc.save('comprobante-de-compra.pdf'); // Save the PDF document
  }
}
