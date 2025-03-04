import { Injectable } from "@angular/core";
import { Usuario } from "../interfaces/usuarios.interface";
import { environments } from '../../environments/environments';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private baseUrl: string = environments.baseUrl;

    constructor(private http: HttpClient){}

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login`, {
            emailOrNickname: email,
            password: password
        });
    }
}