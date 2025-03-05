import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Producto, ProductService} from '../services/product.service';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  productos !: Producto[];
  isModalOpen = false; // Variable para controlar el estado del modal

  images: string[] = [
    '../../assets/images/promocion3.jpg',
    '../../assets/images/promocion4.jpeg',
    '../../assets/images/promocion5.jpeg'
  ];
  currentIndex = 0;
  favoritos !: Producto[];

   form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  

  constructor(private productService: ProductService, private modalCtrl: ModalController) { 
    setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia de imagen cada 3 segundos
  }

  ngOnInit() {
    this.productService.getProductos().subscribe(productos => {
      this.productos = productos;
    });
    this.productService.getFavoriteProducts().subscribe(favoritos => {
      this.favoritos = favoritos;

      console.log(this.favoritos);
    })

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

  toggleFavorite(productId: number) {
    // Llamar al servicio para alternar el estado de favorito
    this.productService.toggleFavorite(productId).subscribe(() => {
      // Actualizar la lista de productos y filtrar los productos favoritos
      this.productService.getProductos().subscribe(productos => {
        this.productos = productos;
        // Filtrar los productos favoritos después de la actualización
        this.favoritos = productos.filter(producto => producto.favorite);
      });
    });
  this.removeNonFavoriteProducts();
  }
  
  
  removeNonFavoriteProducts() {
    // Filtrar los productos para eliminar los que no son favoritos
    this.favoritos = this.productos.filter(producto => producto.favorite);
  }
  
  
  
  
}
