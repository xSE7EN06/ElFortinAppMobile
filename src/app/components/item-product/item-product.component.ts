import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.scss'],
  standalone: false
})
export class ItemProductComponent  implements OnInit {
  @Input() title !: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() image!: string;

  constructor() { }

  ngOnInit() {}

}
