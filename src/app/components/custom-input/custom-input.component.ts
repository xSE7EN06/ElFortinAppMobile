import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: false
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type: string = '';
  @Input() label: string = '';
  @Input() autocomplete: string = '';
  @Input() icon: string = '';
  @Input() errorText!: string; // Mensaje de error
  @Input() eyeToggle: boolean = false;
  @Input() iconInput: boolean = true;

  constructor() { }

  ngOnInit() {}

  getErrorMessage(): string {
    if (!this.control) return '';
    if (this.control.hasError('required')) return 'Este campo es obligatorio.';
    if (this.control.hasError('email')) return 'Ingresa un correo electrónico válido.';
    return '';
  }

}
