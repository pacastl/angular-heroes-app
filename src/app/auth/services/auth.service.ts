import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl=environments.baseUrl;
  private user?:User;

  constructor(private http:HttpClient) { }

  get currentUser():User|undefined{
    if(!this.user) return undefined;
    // Como los obetjos en javaScript se pasan por referencia, se debe hacer una copia
    // Con esto lo podemos evitar
    return structuredClone(this.user);
  }

  login(email:string,password:string): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap( user => this.user = user),
      tap( user => localStorage.setItem('token','idnasdknasmad'))
    )
  }

  checkAuthentication(): Observable<boolean>{

    // Comprobamos el token, si no hay es que no está autenticado
    if(!localStorage.getItem('token')) return of(false);

    const token=localStorage.getItem('token');
    // Usuario autenticado y hacemos peticion para obtenerlo
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      // Establece user (no le cambia el valor)
      tap( user => this.user=user),
      // Nos aseguramos de que es un booleano lo que se devuelve con !!
      map(user => !!user),
      // Si hay un error
      catchError( err => of(false))
    );
  }

  logout(){
    this.user=undefined;
    localStorage.clear();
  }


}
