import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.scss'],
  standalone: false
})
export class ItemProductComponent implements OnInit {
  @Input() title!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() image!: string;
  @Input() favorite!: boolean;  // Recibimos el estado de favorito
  @Input() id!: number;  // Recibimos el id del producto
  
  @Output() favoriteChanged = new EventEmitter<number>(); // Emisor para cuando se cambia el favorito

  constructor() {}

  ngOnInit(): void {}

  toggleFavorite() {
    this.favorite = !this.favorite;  // Cambiar el estado local de favorito
    this.favoriteChanged.emit(this.id);  // Emitir el evento para que el componente padre lo maneje
  
  }
  
  
}
