import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/user.service';
import { AlertController, LoadingController } from '@ionic/angular';

export interface UsuarioRegistro {
  name: string;
  email: string;
  phone: string;
  user_type: string;
  nickname: string;
  password: string;
  image?: string; // opcional
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false
})
export class SignUpPage implements OnInit {


  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido_paterno: new FormControl('', [Validators.required]),
    apellido_materno: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?!.*[_.-]{2})(?![_.-])[a-zA-Z0-9._%+-]+(?<![_.-])@(gmail|outlook|hotmail|example)\.com$/)
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatchValidator });

  constructor(
    private userService: UsuarioService,
    private loadingController: LoadingController,
  private alertController: AlertController
  ) { }

  ngOnInit() { }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (controlName === 'email' && control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }

    if (controlName === 'telefono' && control?.hasError('pattern')) {
      return 'El teléfono debe tener 10 dígitos.';
    }

    if (controlName === 'password' && control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (controlName === 'confirmPassword' && this.form.errors?.['passwordMismatch']) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  }

  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if(this.form.valid){
      const loading = await this.loadingController.create({
        message: 'Registrando usuario...',
        spinner: 'crescent',
        duration: 2000 // opcional si quieres que se cierre solo
      });
  
    await loading.present();
    
    const formData = this.form.value;

    const apellidos = `${formData.apellido_paterno} ${formData.apellido_materno}`;

    const nickname = this.generateNickname(
      formData.nombre!,
      formData.apellido_paterno!,
      formData.password!
    );

    const nuevoUsuario: UsuarioRegistro = {
      name: `${formData.nombre} ${apellidos}`,
      email: formData.email!,
      phone: formData.telefono!,
      user_type: 'client',
      nickname: nickname!,
      password: formData.password!,
      image: '' // puedes dejarlo vacío si no se carga imagen
    };

    this.userService.register(nuevoUsuario).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.presentSuccessAlert();
        this.form.reset();
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error al registrar', err);
        // puedes agregar un alert de error aquí si luego quieres
      }
    });
   }
  }

  generateNickname(nombre: string, apellidoPaterno: string, password: string): string {
    const inicial = nombre.charAt(0).toLowerCase();
    const apellido = apellidoPaterno.toLowerCase().replace(/\s/g, '');
    const passFragment = password.slice(0, 2); // primeros 2 caracteres
    const randomNum = Math.floor(100 + Math.random() * 900); // número de 3 cifras
  
    return `${inicial}${apellido}${passFragment}${randomNum}`;
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'Usuario registrado correctamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentFailAlert() {
    const alert = await this.alertController.create({
      header: '¡Erro!',
      message: 'Ocurrió un error al registrar el usuario. Intenta nuevamente.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

}
