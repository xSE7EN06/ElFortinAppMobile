import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { jsPDF } from 'jspdf';
import { Producto } from '../interfaces/productos.interface';
import { CuponsService } from '../services/cupon/cupons.service';

declare var paypal: any;

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
  mostrarPayPal: boolean = false;


  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController,
    private cuponService: CuponsService
  ) {}

  ngOnInit() {
    this.productService.cantidades$.subscribe(() => {
      this.getTotal();
    });
    this.loadCart();
  }

  loadCart(): void{
    this.productService.getProductsCart().subscribe((productos) => {
      this.cart = productos; // Load products into cart

      if(this.cart.length === 0){
        this.inputCode = "";
        this.discount = 0;
        this.couponErrorMessage = '';
      }
      this.getTotal();
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
            this.total = 0;
            this.subtotal = 0;
            this.discount = 0;
            this.createOrder();
          }
        }
      ]
    });

    await alert.present();
  }

  getTotal(): number {
    this.subtotal = this.cart.reduce((total, item) => {
      const cantidad = this.productService.getCantidad(item.id);
      return total + (item.price * cantidad);
    }, 0);
  }

  createOrder(){
    this.subtotal = this.subtotal - this.discount;
    this.total = this.subtotal - this.discount;
    return this.total;
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
      this.getTotal();
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
    this.getTotal();
  }

  iniciarPagoPayPal() {
    this.mostrarPayPal = true;
  
    setTimeout(() => {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.getTotal().toFixed(2),
                currency_code: 'MXN'
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture();
          console.log('Pago exitoso:', details);
  
          // Generar PDF del ticket
          this.generatePDF();
  
          // Vaciar carrito
          this.cart = [];
          this.productService.clearCart(); 
  
          // Mostrar mensaje
          const alert = await this.alertController.create({
            header: 'Pago exitoso',
            message: `Gracias ${details.payer.name.given_name}, tu pago fue procesado correctamente.`,
            buttons: ['OK']
          });
          await alert.present();
  
          this.mostrarPayPal = false;
          this.total = 0;
          this.subtotal = 0;
          this.discount = 0;
          this.createOrder(); 
        },
        onError: async (err: any) => {
          console.error('Error con PayPal:', err);
          const alert = await this.alertController.create({
            header: 'Error en el pago',
            message: 'Hubo un problema al procesar tu pago.',
            buttons: ['OK']
          });
          await alert.present();
        }
      }).render('#paypal-button-container');
    }, 0);
  }
}
