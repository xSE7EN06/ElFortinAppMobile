import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
  standalone: false
})
export class NoInternetPage {

  constructor(private router: Router) {}

  async retry() {
    const status = await Network.getStatus();
    if (status.connected) {
      this.router.navigate(['/login']); // Redirige a la página principal
    }
  }

}
