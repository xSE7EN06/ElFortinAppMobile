import { Injectable } from "@angular/core";
import { Usuario } from "../interfaces/usuarios.interface";
import { environment } from '../../environments/environment.prod';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private baseUrl: string = environment.baseUrl;

    constructor(private http: HttpClient){}

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login`, {
            emailOrNickname: email,
            password: password
        }).pipe(
            tap(response => {
                if(response.token){
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    getUserIdFormToken(): number | null{
        const token = localStorage.getItem('token');
        if(!token) return null;

        try{
            const decoded: any = jwtDecode(token);
            console.log(decoded.id);
            return decoded.id;
        }catch(error){
            console.log("Error al decodificar el token", error);
            return null;
        }
    }

    logOut(){
        localStorage.removeItem('token');
    }
}