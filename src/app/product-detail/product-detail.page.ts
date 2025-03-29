import { Component, OnInit } from '@angular/core';
import { Producto } from '../interfaces/productos.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false
})
export class ProductDetailPage implements OnInit {
  product:any;

  carrito: boolean = false;

  constructor( private route: ActivatedRoute, private productService: ProductService, private toast: ToastController) { }

  ngOnInit() {
    this.product = this.productService.getProduct();
    //this.carrito = this.productService.isProductCart(this.product);
    //console.log('Producto recibido:', this.product);

    this.productService.getProductsCart().subscribe((carritos) => {
      this.carrito = carritos.some((p) => p.id === this.product.id);
    });
  }

  saveProductInCart(event: Event){
      if(!this.carrito){
        event.stopPropagation();
        this.productService.toggleCart(this.product);
      }else{
        this.toast.create({
          message: `¡${this.product.name},  ya esta agregado en el carrito!`,
          duration: 1500,
          position: 'bottom',
          icon: "information-circle",
          color: 'success',
        }).then(toast => toast.present());
      }
  }

}
