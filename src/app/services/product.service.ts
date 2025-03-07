import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Producto } from '../interfaces/productos.interface';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Obtener el endpoint de nuestra API
  private baseUrl: string = environment.baseUrl;

  // Lista de favoritos
  private favoritos: Producto[] = [];

  //Lista para el carrito de compras
  private carrito: Producto[] = [];

  // BehaviorSubject para emitir cambios en la lista de favoritos
  private favoritosSubject = new BehaviorSubject<Producto[]>(this.favoritos);

  private carritoSubject = new BehaviorSubject<Producto[]>(this.carrito);

  // Observable para que los componentes se suscriban a cambios en los favoritos
  favoritos$ = this.favoritosSubject.asObservable();

  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient, private toastController: ToastController) {
    // Cargar favoritos desde localStorage
    this.loadFavoritesFromStorage();
    this.loadCartFromStorage();
  }

  // Obtener la lista de productos desde la API
  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/products`);
  }

  // Obtener la lista de favoritos como Observable
  getFavorites(): Observable<Producto[]> {
    return this.favoritos$;
  }

  getProductsCart(): Observable<Producto[]>{
    return this.carrito$;
  }

  // Verificar si un producto es favorito
  isFavorite(producto: Producto): boolean {
    return this.favoritos.some((p) => p.id === producto.id);
  }

  // Alternar el estado de favorito
  toggleFavorite(producto: Producto): void {
    const index = this.favoritos.findIndex((p) => p.id === producto.id);
    if (index === -1) {
      if (producto) {
        this.toastController.create({
          message:`¡${producto.name}, se agrego a favoritos!`,
          duration: 1500,
          position: 'bottom',
          icon:"add-circle-outline",
          color: 'success',
        }).then(toast => toast.present());
    
        this.favoritos.push(producto); // Agregar a favoritos
      }
    } else {
      this.toastController.create({
        message:`¡${producto.name}, se elimino de favoritos!`,
        duration: 1500,
        position: 'bottom',
        icon:"close-circle-outline",
        color: 'success',
      }).then(toast => toast.present());
      this.favoritos.splice(index, 1); // Quitar de favoritos
    }
    this.favoritosSubject.next(this.favoritos);
    this.saveFavoritesToStorage(); // Guardar en localStorage 
  }

  // Cargar favoritos desde localStorage 
  private loadFavoritesFromStorage(): void {
    const favoritosGuardados = localStorage.getItem('favoritos');
    if (favoritosGuardados) {
      this.favoritos = JSON.parse(favoritosGuardados);
      this.favoritosSubject.next(this.favoritos); // Emitir la lista cargada
    }
  }

  // Guardar favoritos en localStorage 
  private saveFavoritesToStorage(): void {
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }

  toggleCart(producto: Producto): void{
    const index = this.carrito.findIndex((p) => p.id === producto.id);
    if (index === -1){
      if(producto){
        this.toastController.create({
          message:`¡${producto.name}, se agrego al carrito!`,
          duration: 1500,
          position: 'bottom',
          icon:"cart",
          color: 'success',
        }).then(toast => toast.present());
        this.carrito.push(producto);
      }
    }else{
      this.toastController.create({
        message:`¡${producto.name}, se elimino del carrito!`,
        duration: 1500,
        position: 'bottom',
        icon:"cart",
        color: 'success',
      }).then(toast => toast.present());
      this.carrito.splice(index, 1);
    }

    this.carritoSubject.next(this.carrito);
    this.saveCartToStorage();
  }

  private loadCartFromStorage(): void{
    const productosCarrito = localStorage.getItem('carrito');
    if(productosCarrito){
      this.carrito = JSON.parse(productosCarrito);
      this.carritoSubject.next(this.carrito);
    }
  }

  private saveCartToStorage(): void{
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  isProductCart(producto: Producto): boolean{
    return this.carrito.some((p) => p.id === producto.id);
  }
}
