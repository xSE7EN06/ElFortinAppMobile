import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { UsuarioService } from '../services/user.service';
import { App } from '@capacitor/app';
import { HeaderComponent } from '../components/header/header.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  @ViewChild(HeaderComponent) headerComponent: HeaderComponent | undefined;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private loadingCtrl: LoadingController, private route: Router,  private alertCtrl: AlertController,
    private usuarioService: UsuarioService, private toastController: ToastController, private plataform: Platform,
    private navCtrl: NavController, private router: Router
  ) {
    this.plataform.backButton.subscribeWithPriority(10, ()=> {
      const currentUrl = this.router.url;
      if(currentUrl === '/login' || currentUrl === "/splash"){
        App.exitApp();
      }else if(currentUrl === '/home'){
        if(this.headerComponent)
          this.headerComponent.confirmLogout();
      }else{
        this.navCtrl.back();
      }
    });
  }

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
        
        if(response.token){
          localStorage.setItem('token', response.token);
        }

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
