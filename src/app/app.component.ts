import { Component } from '@angular/core';
import { StatusBar, Style} from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  // Cada vez que se incia la app, se cargan estos valores
  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setOverlaysWebView({ overlay: false }); // evita el toolbar se desplace hasta la barra de estado
      StatusBar.setBackgroundColor({ color: '#99582a' }); // cambia el color de la barra de estado
    });
  }
}
