import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: false
})
export class LogoComponent  implements OnInit {

  @Input() imagen: string = '';

  constructor() { }

  ngOnInit() {}

}
