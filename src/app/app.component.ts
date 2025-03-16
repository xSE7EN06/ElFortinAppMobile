import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { StatusBar, Style} from '@capacitor/status-bar';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private wasOffline = false;

  constructor(private platform: Platform, private router: Router, private toastController: ToastController) {
    this.initializeApp();
    this.checkNetwork();
  }

  // Cada vez que se incia la app, se cargan estos valores
  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setOverlaysWebView({ overlay: false }); // evita el toolbar se desplace hasta la barra de estado
      StatusBar.setBackgroundColor({ color: '#99582a' }); // cambia el color de la barra de estado
    });
  }

  async checkNetwork() {
    // Verificar la conexión al iniciar
    const status = await Network.getStatus();
    if (!status.connected) {
      this.router.navigate(['/no-internet']);
      this.wasOffline = true; // Marcar que estuvo sin conexión
    }

    // Escuchar cambios en la conexión
    Network.addListener('networkStatusChange', async (status) => {
      if (!status.connected) {
        this.router.navigate(['/no-internet']);
        this.wasOffline = true; // Marcar que se quedó sin conexión

        // Mostrar mensaje de que no hay conexión
        const toast = await this.toastController.create({
          message: "En este momento no tienes conexión",
          duration: 1500,
          position: 'bottom',
          icon: "wifi-outline",
          color: 'success',
        });
        await toast.present();
      } else {
        if (this.wasOffline) { // Solo mostrar el mensaje si antes estaba sin conexión
          this.wasOffline = false; // Reiniciar bandera

          // Mostrar mensaje de que ya tiene conexión
          const toast = await this.toastController.create({
            message: "Se restauro la conexión a internet.",
            duration: 1500,
            position: 'bottom',
            icon: "wifi-outline",
            color: 'success',
          });
          await toast.present();
        }
      }
    });
  }
}
