import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ordenes } from 'src/app/interfaces/ordenes';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl: string = environment.baseUrl;
  private order: Ordenes[] = [];

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Ordenes[]> {
    return this.http.get<{codigo: number, data: Ordenes[]}>(`${this.baseUrl}/orders`).pipe(
      map(response => response.data)
    );
  }

}
