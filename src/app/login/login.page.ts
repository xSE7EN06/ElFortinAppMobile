import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private loadingCtrl: LoadingController, private route: Router) { }

  ngOnInit() {
  }

  //cramos una funcion para manejar los errores de login.page.html
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
  
    //validamos y retornamos
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
  
    if (control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }
    return ''; // Si no hay errores, retorna un string vacío
  }

  async login(){
    const loading = await this.loadingCtrl.create({
      message: "Iniciando sesión",
      duration: 2000,
    });

    await loading.present(); // Espera a que se muestre el loading

    await loading.onDidDismiss(); // Espera a que termine el loading antes de navegar
  
    this.route.navigate(['/home']); // Ahora se ejecuta la navegación
  }
}
