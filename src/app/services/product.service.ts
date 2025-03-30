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
  private selectedProduct: any;

  private userId: number = 0;

  private cantidades: Map<number, number> = new Map();
  private cantidadesSubject = new BehaviorSubject<Map<number, number>>(this.cantidades);
  cantidades$ = this.cantidadesSubject.asObservable();


  constructor(private http: HttpClient, private toastController: ToastController) {
    // Cargar favoritos desde localStorage
    this.loadFavoritesFromStorage();
    this.loadCartFromStorage();
  }

  setUserId(userId: number): void {
    this.userId = userId;
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

  getProductsCart(): Observable<Producto[]> {
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
          message: `¡${producto.name}, se agrego a favoritos!`,
          duration: 1500,
          position: 'bottom',
          icon: "add-circle-outline",
          color: 'success',
        }).then(toast => toast.present());

        this.favoritos.push(producto); // Agregar a favoritos
      }
    } else {
      this.toastController.create({
        message: `¡${producto.name}, se elimino de favoritos!`,
        duration: 1500,
        position: 'bottom',
        icon: "close-circle-outline",
        color: 'success',
      }).then(toast => toast.present());
      this.favoritos.splice(index, 1); // Quitar de favoritos
    }
    this.favoritosSubject.next(this.favoritos);
    this.saveFavoritesToStorage(); // Guardar en localStorage 
  }

  // Cargar favoritos desde localStorage 
  private loadFavoritesFromStorage(): void {
    if (!this.userId) return;
    const favoritosGuardados = localStorage.getItem(`favoritos_${this.userId}`);
    if (favoritosGuardados) {
      this.favoritos = JSON.parse(favoritosGuardados);
      this.favoritosSubject.next(this.favoritos);
    } else {
      this.favoritos = [];
      this.favoritosSubject.next([]);
    }
  }

  // Guardar favoritos en localStorage 
  private saveFavoritesToStorage(): void {
    if (!this.userId) return;
    localStorage.setItem(`favoritos_${this.userId}`, JSON.stringify(this.favoritos));
  }

  toggleCart(producto: Producto): void {
    const index = this.carrito.findIndex((p) => p.id === producto.id);
    if (index === -1) {
      if (producto) {
        this.toastController.create({
          message: `¡${producto.name}, se agrego al carrito!`,
          duration: 1500,
          position: 'bottom',
          icon: "cart",
          color: 'success',
        }).then(toast => toast.present());
        this.carrito.push(producto);
      }
    } else {
      this.toastController.create({
        message: `¡${producto.name}, se elimino del carrito!`,
        duration: 1500,
        position: 'bottom',
        icon: "cart",
        color: 'success',
      }).then(toast => toast.present());
      this.carrito.splice(index, 1);
    }

    this.carritoSubject.next(this.carrito);
    this.saveCartToStorage();
  }

  private loadCartFromStorage(): void {
    if (!this.userId) return;
    const productosCarrito = localStorage.getItem(`carrito_${this.userId}`);
    if (productosCarrito) {
      this.carrito = JSON.parse(productosCarrito);
      this.carritoSubject.next(this.carrito);
    } else {
      this.carrito = [];
      this.carritoSubject.next([]);
    }
  }

  private saveCartToStorage(): void {
    if (!this.userId) return;
    localStorage.setItem(`carrito_${this.userId}`, JSON.stringify(this.carrito));
  }

  isProductCart(producto: Producto): boolean {
    return this.carrito.some((p) => p.id === producto.id);
  }

  // Método para obtener un producto por su id
  getProductById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/products/${id}`);
  }

  setProduct(product: any) {
    this.selectedProduct = product;
  }

  getProduct() {
    return this.selectedProduct;
  }

  //CALCULAR PRECIOS DEL CARRITO 
  getCantidad(productId: number): number {
    return this.cantidades.get(productId) || 1;
  }

  setCantidad(productId: number, cantidad: number): void {
    this.cantidades.set(productId, cantidad);
    this.cantidadesSubject.next(this.cantidades);
    this.saveCantidadesToStorage();
  }

  loadCantidadesFromStorage(): void {
    const raw = localStorage.getItem(`cantidades_${this.userId}`);
    if (raw) {
      const obj = JSON.parse(raw);
      this.cantidades = new Map<number, number>();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.cantidades.set(Number(key), obj[key]);
      }
    }

    this.cantidadesSubject.next(this.cantidades);
    }
  }

  private saveCantidadesToStorage(): void {
    const obj: { [key: number]: number } = {};
    this.cantidades.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem(`cantidades_${this.userId}`, JSON.stringify(obj));
  }

  clearCart() {
    this.carrito = [];
    this.carritoSubject.next([]);
    localStorage.removeItem(`carrito_${this.userId}`);
    localStorage.removeItem(`cantidades_${this.userId}`);
  }
}
