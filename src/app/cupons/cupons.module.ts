import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuponsPageRoutingModule } from './cupons-routing.module';

import { CuponsPage } from './cupons.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuponsPageRoutingModule,
    ComponentsModule
],
  declarations: [CuponsPage]
})
export class CuponsPageModule {}
