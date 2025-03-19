import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cupon } from 'src/app/interfaces/cupones';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CuponsService {

  private baseUrl: string = environment.baseUrl;
  private cupon: Cupon[] = [];

  constructor(private http: HttpClient) { 

  }

  getCupons(): Observable<Cupon[]> {
    return this.http.get<{codigo: number, data: Cupon[]}>(`${this.baseUrl}/promociones`).pipe(
      map(response => response.data)
    );
  }

  getCuponById(idCode: number): Observable<Cupon> {
    return this.http.get<Cupon>(`${this.baseUrl}/promociones/${idCode}`);
  }

  setCupons(cupones: Cupon[]): void{
    this.cupon = cupones;
  }

  getCuponss(): Cupon[]{
    return this.cupon;
  }
  
}
