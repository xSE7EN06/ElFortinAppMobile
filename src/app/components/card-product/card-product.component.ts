import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
  standalone: false
})
export class CardProductComponent  implements OnInit {

  @Input() imagen: string = '';
  @Input() title: string = '';

  constructor(private navController: NavController) { }

  ngOnInit() {}

  verMas(){
    this.navController.navigateForward("/product-item");
  }

}
