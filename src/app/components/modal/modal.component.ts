import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxCustomEvent, IonModal, ModalController, NavController, NavParams } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/productos.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent implements OnInit {
  title!: string;
  productos!: Producto[];
  productosRestaurante: Producto[] = [];
  productosBebidas: Producto[] = [];
  productosPanaderia: Producto[] = [];
  productosFiltrados: Producto[] = [];

  constructor(private navCtrl: NavController, private navParams: NavParams, private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.title = this.navParams.get('title');
    this.productos = this.navParams.get('productos');
    this.productosRestaurante = this.productos.filter(productos => productos.category_name === "Restaurante");
    this.productosBebidas = this.productos.filter(productos => productos.category_name === "Bebidas");
    this.productosPanaderia = this.productos.filter(productos => productos.category_name === "Panaderia");
    
    if (this.title === 'Restaurante') {
      this.productosFiltrados = [...this.productosRestaurante];
    } else if (this.title === 'Bebidas') {
      this.productosFiltrados = [...this.productosBebidas];
    } else {
      this.productosFiltrados = [...this.productosPanaderia];
    }
  }

  closeModal(event: any) {
    event.target.closest('ion-modal').dismiss();
  }

  openCart(event: any) {
    this.navCtrl.navigateForward('/cart');
    event.target.closest('ion-modal').dismiss();
  }

  goToDetail(product: any) {
    this.productService.setProduct(product);
    this.router.navigate(['/product-detail']);
  }

  //funcion para buscar productos con el search-bar
  searchProduct(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (this.title === 'Restaurante') {
      if (texto === '') {
        this.productosFiltrados = [...this.productosRestaurante];
      } else {
        this.productosFiltrados = this.productosRestaurante.filter((producto) =>
          producto.name.toLowerCase().includes(texto)
        );
      }
    } else if (this.title === 'Bebidas') {
      if (texto === '') {
        this.productosFiltrados = [...this.productosBebidas];
      } else {
        this.productosFiltrados = this.productosBebidas.filter((producto) =>
          producto.name.toLowerCase().includes(texto)
        );
      }
    } else {
      if (texto === '') {
        this.productosFiltrados = [...this.productosPanaderia];
      } else {
        this.productosFiltrados = this.productosPanaderia.filter((producto) =>
          producto.name.toLowerCase().includes(texto)
        );
      }
    }
  }
}
