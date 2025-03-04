import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CheckboxCustomEvent, IonModal, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent {
  constructor(private navCtrl: NavController) {}

  closeModal(event: any) {
    event.target.closest('ion-modal').dismiss();
  }

  openCart(event: any){
    this.navCtrl.navigateForward('/cart');
    event.target.closest('ion-modal').dismiss();
  }
}
