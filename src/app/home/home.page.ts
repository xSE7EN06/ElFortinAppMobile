import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService} from '../services/product.service';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalController, ToastController } from '@ionic/angular';
import { Producto } from '../interfaces/productos.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  productos: Producto[] = [];
  favoritos: Producto[] = [];
  carrito: Producto[] = [];
  isModalOpen = false; // Variable para controlar el estado del modal
  

  images: string[] = [
    '../../assets/images/promocion3.jpg',
    '../../assets/images/promocion4.jpeg',
    '../../assets/images/promocion5.jpeg'
  ];
  currentIndex = 0;

   form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  

  constructor(private productService: ProductService, private modalCtrl: ModalController, private toastController: ToastController) { 
    setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia de imagen cada 3 segundos
  }

  ngOnInit() {
    this.loadProductos();
    //this.loadFavorites();
  }

  //cramos una funcion para manejar los errores de login.page.html
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
  
    //validamos y retornamos
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
  
    if (control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }
    return ''; // Si no hay errores, retorna un string vacío
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
    });

    return await modal.present();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  loadProductos(): void {
    this.productService.getProducts().subscribe((productos) => {
      this.productos = productos;
    });

    this.productService.getFavorites().subscribe((favoritos) => {
      this.favoritos = favoritos;
    });

    this.productService.getProductsCart().subscribe((carrito) => {
      this.carrito = carrito;
    });
  }
}
