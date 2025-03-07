import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UsuarioService } from '../services/user.service';


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

  constructor(private loadingCtrl: LoadingController, private route: Router,  private alertCtrl: AlertController,
    private usuarioService: UsuarioService, private toastController: ToastController
  ) { }

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
    if (this.form.invalid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: "Iniciando sesión...",
    });

    await loading.present(); // Espera a que se muestre el loading

    
    const { email, password } = this.form.value as { email: string; password: string };
    console.log('Datos enviados:', { email, password });

    this.usuarioService.login(email, password).subscribe({
      next: async (response) => {
        await loading.dismiss();
        // Mostrar mensaje de bienvenida
        const toast = await this.toastController.create({
        message: '¡Bienvenido!', // Mensaje fijo o puedes usar response.data
        duration: 1000, // 3 segundos
        position: 'middle',
        color: 'success',
      });
        await toast.present();
        this.route.navigate(['/home']); // Redirigir a Home después del mensaje
      },
      error: async (error) => {
        console.error('Error en login:', error);
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Usuario o contraseña incorrectos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
