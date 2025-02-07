import { Component, Input,OnInit } from '@angular/core';
@Component({
  selector: 'app-item-cart',
  templateUrl: './item-cart.component.html',
  styleUrls: ['./item-cart.component.scss'],
  standalone: false,
})
export class ItemCartComponent  implements OnInit {

  @Input() title !: string;
  @Input() totalPrice!: number;
  @Input() image!: string;
  @Input() quantity!: number;

  constructor() { }

  ngOnInit() {}

}
