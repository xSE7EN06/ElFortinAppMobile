import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage {
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('/login'); // Redirect to home page
    }, 2000); // Adjust delay as needed
  }
}