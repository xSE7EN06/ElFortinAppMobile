import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {

  @Input() title !: string;
  @Input() showLogout: boolean = true; // Controla la visibilidad del botón
  @Input() mostrar: boolean = true;
  @Input() mostrarBtnModal: boolean = true;

  constructor(private alertController: AlertController,
    private toastController: ToastController, private route: Router, private userServices: UsuarioService) { }

  ngOnInit() {}

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado cerrar sesión');
          }
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            console.log('Cerrando sesión...');
            this.userServices.logOut();
            this.presentToast('Sesión cerrada.', 'success').then(() => {
              this.route.navigate(['/login']); // Navega al login después de mostrar el toast
            });
          }
        }
      ]
    });
  
    await alert.present();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  closeModal(event: any) {
    event.target.closest('ion-modal').dismiss();
  }

}
