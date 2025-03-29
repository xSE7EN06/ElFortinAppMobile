import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ModalComponent } from '../components/modal/modal.component';
import { IonTabs, ModalController, ToastController } from '@ionic/angular';
import { Producto } from '../interfaces/productos.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UsuarioService } from '../services/user.service';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuarios.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  @ViewChild(IonTabs) tabs!: IonTabs;

  productos: Producto[] = [];
  favoritos: Producto[] = [];
  carrito: Producto[] = [];
  isModalOpen = false; // Variable para controlar el estado del modal
  profileImage: string = "../../assets/icon/avtar.png";
  titleRestaurant = "Restaurante";
  titleDrink = "Bebidas";
  titleBread = "Panaderia";

  fabOpen = false;

  //variabel para almacenar el id del token
  userId: number | null = null;

  productosFiltrados: Producto[] = [...this.productos];

  public usuario?: Usuario;

  images: string[] = [
    '../../assets/images/promocion3.jpg',
    '../../assets/images/promocion4.jpeg',
    '../../assets/images/promocion5.jpeg'
  ];
  currentIndex = 0;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.select('home');
    });
  }

  ionViewDidEnter() {
    this.tabs.select('home');
  }

  userForm = new FormGroup({
    names: new FormControl('', [Validators.required]),
    apellido_paterno: new FormControl('', [Validators.required]),
    apellido_materno: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
  })


  get currentUsuer(): Usuario {
    const user = this.userForm.value as Usuario;
    return user;
  }

  constructor(private productService: ProductService, private modalCtrl: ModalController, private router: Router, private userService: UsuarioService,
     private toastContoller: ToastController
  ) {
    setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia de imagen cada 3 segundos
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

  if (!token) {
    this.router.navigate(['/login']);
    return; // Evita seguir ejecutando loadUser() sin sesión
  }

  this.loadProductos();
  this.loadUser();
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
  
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
  
    if (controlName === 'email' && control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }
  
    if (controlName === 'telefono' && control?.hasError('pattern')) {
      return 'Debe ser un número de 10 dígitos.';
    }
  
    return '';
  }

  async openModal(title: string, productos: Producto[]) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        title: title,
        productos: productos
      }
    });

    return await modal.present();
  }


  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  loadProductos(): void {
    this.productService.getProducts().subscribe((productos) => {
      this.productos = productos;
      this.productosFiltrados = [...productos];
    });

    this.productService.getFavorites().subscribe((favoritos) => {
      this.favoritos = favoritos;
    });

    this.productService.getProductsCart().subscribe((carrito) => {
      this.carrito = carrito;
    });
  }


  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      console.log('Base64 Image:', image.base64String); 

      if (image.base64String) {
        this.profileImage = `data:image/jpeg;base64,${image.base64String}`;
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      alert('No se pudo acceder a la cámara o la acción fue cancelada.');
    }
  }


  //funcion para buscar productos con el search-bar
  searchProduct(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (texto === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((producto) =>
        producto.name.toLowerCase().includes(texto)
      );
    }
  }

  goToDetail(product: any) {
    this.productService.setProduct(product);
    this.router.navigate(['/product-detail']);
  }

  //Cunsumir api para ver la cuenta que inicio sesion.
  loadUser() {
    const id_user = this.userService.getUserIdFormToken();

  if (!id_user) {
    return;
  }

    this.userService.getUserById(id_user).subscribe((user) => {
      if (user) {
        this.usuario = user;

        const { nombres, apellidoPaterno, apellidoMaterno } = this.separarNombreCompleto(user.name);

        this.userForm.reset();
        this.userForm.patchValue({
          names: nombres,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          email: user.email,
          password: '',
          telefono: user.phone ? user.phone.toString() : ''
        });

        this.profileImage = user.image_url?.trim()
          ? user.image_url
          : '../../assets/icon/avtar.png';
      } else {
        this.profileImage = '../../assets/icon/avtar.png';
      }
    });
  }

  // Método para alternar la visibilidad del menú FAB
  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }

  separarNombreCompleto(nombreCompleto: string): {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  } {
    const partes = nombreCompleto.trim().split(' ');

    if (partes.length < 3) {
      return {
        nombres: partes.slice(0, 1).join(' '),
        apellidoPaterno: partes[1] || '',
        apellidoMaterno: ''
      };
    }

    return {
      nombres: partes.slice(0, partes.length - 2).join(' '),
      apellidoPaterno: partes[partes.length - 2],
      apellidoMaterno: partes[partes.length - 1]
    };
  }

  async guardarCambios() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    const loading = await this.toastContoller.create({
      message: 'Guardando cambios...',
      duration: 1000,
      color: 'primary'
    });
    await loading.present();
  
    const { names, apellido_paterno, apellido_materno, email, password, telefono } = this.userForm.value;
  
    const nombreCompleto = `${names} ${apellido_paterno} ${apellido_materno}`;
    
  
    const usuarioActualizado = {
      name: nombreCompleto,
      email,
      phone: telefono,
      password,
      image_url: this.profileImage !== '../../assets/icon/avtar.png' ? this.profileImage : null
    };
  
    const userId = this.userService.getUserIdFormToken();
    if (!userId) return;
  
    this.userService.updateUser(userId, usuarioActualizado).subscribe({
      next: async () => {
        const alert = await this.toastContoller.create({
          message: 'Cambios guardados correctamente',
          duration: 1500,
          color: 'success',
          position: 'bottom'
        });
        alert.present();
      },
      error: async () => {
        const alert = await this.toastContoller.create({
          message: 'Ocurrió un error al guardar',
          duration: 1500,
          color: 'danger',
          position: 'bottom'
        });
        alert.present();
      }
    });
  }

  resetUserData() {
    this.usuario = undefined;
    this.profileImage = '../../assets/icon/avtar.png';
    this.userForm.reset();
    this.router.navigate(['/login']);
  }
}
