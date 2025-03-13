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
export class ModalComponent implements OnInit{
  title!: string;
  productos!: Producto[];

  constructor(private navCtrl: NavController, private navParams: NavParams, private productService: ProductService, private router: Router) {}

  ngOnInit(){
    this.title = this.navParams.get('title');
    this.productos = this.navParams.get('productos');
  }

  closeModal(event: any) {
    event.target.closest('ion-modal').dismiss();
  }

  openCart(event: any){
    this.navCtrl.navigateForward('/cart');
    event.target.closest('ion-modal').dismiss();
  }

  goToDetail(product: any){
    this.productService.setProduct(product);
    this.router.navigate(['/product-detail']);
  }
}
