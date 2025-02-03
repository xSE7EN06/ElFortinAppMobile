import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from './logo/logo.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FabButtonCartComponent } from './fab-button-cart/fab-button-cart.component';
import { ItemProductComponent } from './item-product/item-product.component';
import { CardProductComponent } from './card-product/card-product.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    FabButtonCartComponent,
    ItemProductComponent,
    CardProductComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    FabButtonCartComponent,
    ItemProductComponent,
    CardProductComponent
  ]
})
export class ComponentsModule { }
