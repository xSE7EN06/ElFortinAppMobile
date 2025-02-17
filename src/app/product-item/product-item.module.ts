import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductItemPageRoutingModule } from './product-item-routing.module';

import { ProductItemPage } from './product-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductItemPageRoutingModule
  ],
  declarations: [ProductItemPage]
})
export class ProductItemPageModule {}
