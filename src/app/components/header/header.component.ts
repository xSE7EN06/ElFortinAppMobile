import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


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
    private toastController: ToastController, private route: Router) { }

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
            // Aquí añadirías la lógica para manejar el cierre de sesión
            // Por ejemplo, llamar a authService.logout() o similar
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
