import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from './logo/logo.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemProductComponent } from './item-product/item-product.component';
import { LayoutComponent } from './layout/layout.component';
import { ItemCartComponent } from './item-cart/item-cart.component';
import { ModalComponent } from './modal/modal.component';
import { ItemOptionComponent } from './item-option/item-option.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    ItemProductComponent,
    LayoutComponent,
    ItemCartComponent,
    ModalComponent,
    ItemOptionComponent
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
    ItemProductComponent,
    LayoutComponent,
    ItemCartComponent,
    ModalComponent,
    ItemOptionComponent
  ]
})
export class ComponentsModule { }
