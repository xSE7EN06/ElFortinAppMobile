import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Producto } from 'src/app/interfaces/productos.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.scss'],
  standalone: false
})
export class ItemProductComponent implements OnInit {
  @Input() productoSelected: any;
  @Output() productSelected = new EventEmitter<any>();
  @Input()

  public producto !: Producto;

  favorite: boolean = false;
  carrito: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
   // Verificar si el producto es favorito al iniciar
   this.favorite = this.productService.isFavorite(this.producto);

   this.carrito = this.productService.isProductCart(this.producto);

   // Suscribirse a cambios en la lista de favoritos
   this.productService.getFavorites().subscribe((favoritos) => {
     this.favorite = favoritos.some((p) => p.id === this.producto.id);
   });

   this.productService.getProductsCart().subscribe((carritos) => {
     this.carrito = carritos.some((p) => p.id === this.producto.id);
   });
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.productService.toggleFavorite(this.producto);
  }

  toggleCart(event: Event): void {
    event.stopPropagation();
    this.productService.toggleCart(this.producto);
  }

  onProductClick() {
    this.productSelected.emit(this.producto);
  }
}
