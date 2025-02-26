import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false
})
export class SignUpPage implements OnInit {

   form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })

  constructor() { }

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

}
