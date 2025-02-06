import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Producto{
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productos: Producto[] = [
    { id: 1, title: 'Pizza de peperoni', description: 'Deliciosa pizza', price: 330, image: '../../assets/icon/pizza.png'},
    { id: 2, title: 'Hamburguesa clásica', description: 'Jugosa hamburguesa con queso y vegetales', price: 250, image: '../../assets/icon/logop.png' },
    { id: 3, title: 'Tacos al pastor', description: 'Tacos con carne de cerdo marinada', price: 180, image: '../../assets/icon/logop.png' },
    { id: 4, title: 'Ensalada César', description: 'Ensalada fresca con pollo y aderezo César', price: 200, image: '../../assets/icon/logop.png' },
    { id: 5, title: 'Sushi variado', description: 'Selección de sushi con pescado fresco', price: 400, image: '../../assets/icon/logop.png' },
    { id: 6, title: 'Pasta carbonara', description: 'Pasta con salsa cremosa de huevo y tocino', price: 280, image: '../../assets/icon/logop.png' },
    { id: 7, title: 'Helado de vainilla', description: 'Helado suave y cremoso de vainilla', price: 120, image: '../../assets/icon/logop.png' },
    { id: 8, title: 'Café americano', description: 'Café negro fuerte y aromático', price: 80, image: '../../assets/icon/bebida.png' },
    { id: 9, title: 'Batido de fresa', description: 'Batido refrescante de fresa', price: 150, image: '../../assets/icon/logop.png' },
    { id: 10, title: 'Tarta de chocolate', description: 'Tarta rica y decadente de chocolate', price: 220, image: '../../assets/icon/logop.png' }
  ];

  constructor() { }

  //funcion para obtener los productos
  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }
}
