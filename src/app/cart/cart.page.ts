import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { jsPDF } from 'jspdf';
import { Producto } from '../interfaces/productos.interface';
import { CuponsService } from '../services/cupon/cupons.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false
})
export class CartPage implements OnInit {
  cart: Producto[] = [];
  isModalOpen = false;
  itemToRemove: Producto | null = null;
  inputCode: string = "";
  couponErrorMessage: string = "";
  input: boolean = true;

  //variables para la logica de compra
  subtotal: number = 0;
  total: number = 0;
  discount: number = 0;


  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController,
    private cuponService: CuponsService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart(): void{
    this.productService.getProductsCart().subscribe((productos) => {
      this.cart = productos; // Load products into cart
    });
  }

  async checkout() {
    if (this.cart.length === 0) {
      this.presentToast('El carrito está vacío.', 'success');
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
    this.subtotal = this.cart.reduce((total, item) => total + item.price, 0);
    this.subtotal = this.subtotal - this.discount;
    
    return this.total = this.subtotal;
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

  openConfirmModal(item: Producto) {
    this.itemToRemove = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.itemToRemove = null;
  }

  async removeFromCart() {
    if (this.itemToRemove) {
      await this.productService.toggleCart(this.itemToRemove);
      this.cart = this.cart.filter(p => p !== this.itemToRemove);
    }
    this.closeModal();
  }

  searchCupon(){
    if (this.inputCode.trim() === "") {
      // Si el campo está vacío, mostrar mensaje de error
      this.couponErrorMessage = "";
      this.discount = 0;
      return;
    }

    const cupon = this.cuponService.getCuponss().find((cupon) => cupon.code === this.inputCode);
    
    if (cupon) {
      this.couponErrorMessage = ""; // Si el cupón es válido, limpiar el mensaje de error
      this.discount = cupon.value;
      console.log('Cupón válido:', cupon);
    } else {
      this.couponErrorMessage = "Código incorrecto"; // Si el cupón no es válido, mostrar el mensaje
      this.discount = 0;
    }
  }
}
