import { Component, OnInit } from '@angular/core';
import { Producto } from '../interfaces/productos.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false
})
export class ProductDetailPage implements OnInit {
  product:any;

  constructor( private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    this.product = this.productService.getProduct();
    console.log('Producto recibido:', this.product);
  }

}
