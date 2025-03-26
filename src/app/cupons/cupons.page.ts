import { Component, OnInit } from '@angular/core';
import { CuponsService } from '../services/cupon/cupons.service';
import { Cupon } from '../interfaces/cupones';
import { Usuario } from '../interfaces/usuarios.interface';
import { UsuarioService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.page.html',
  styleUrls: ['./cupons.page.scss'],
  standalone: false
})
export class CuponsPage implements OnInit {

  cupones: Cupon[] = [];
  usuario: Usuario | null = null;
  cupon : Cupon | null = null;
  
  constructor(private cuponsService: CuponsService, private usuarioService: UsuarioService, private toastController: ToastController) { }

  ngOnInit() {
    this.loadCupons();
  }

  async loadCupons() {
    const id = this.usuarioService.getUserIdFormToken();
    this.usuario = await this.obtenerUsuario(id);

    this.cuponsService.getCupons().subscribe((cupones) => {
      if(!this.usuario){
        this.cupones = []; //Si no hay usuario, no hay cupones
        return;
      }

      //Obtener creacion de usuario de string a Date
      const userYear = new Date(this.usuario.created_at).getFullYear();
      const isNewUser = userYear === 2025;

      // Establecer los cupones en el servicio
    this.cuponsService.setCupons(cupones.filter((cupon) => {
      return cupon.code !== "NEW25" || isNewUser;
    }));

    // Puedes mantener la propiedad cupones también en el componente, si lo deseas
    this.cupones = cupones.filter((cupon) => {
      return cupon.code !== "NEW25" || isNewUser;
    });
    
    });
  }

  async obtenerUsuario(id: number | null): Promise<Usuario | null> {
    return firstValueFrom(this.usuarioService.getUserById(id));
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      icon: "copy"
    });
    toast.present();
  }



  //funcion para copiar el texto o el codigo de la promoción
  async copyToClipPromo(code: string){
    await Clipboard.write({
      string: code
    });

    if(code != ""){
      this.presentToast("¡Texto Copiado!");
    }
  }
}
