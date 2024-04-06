import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string=environments.baseUrl;

  constructor(private http:HttpClient) { }

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  // El udnefined es por si el usuarioe sribe un heroe que no existe
  getHeroById(id:string):Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
    // Si el id introducido es algo que no existe, saltaría el error 404 y por eso usamos el pipe para manejarlo
    .pipe(
      // of nos permite crear un Observable que devuelve el udnefined
      catchError( error => of(undefined))
    );
  }

  // Si no devuelve nada, siempre devolverá un aray vacío
  getSuggestions( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=6`);
  }

  // Si queremos que busque solo en el campo superhero en lugar de todos
  // getSuggestions( query: string ): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(`${ this.baseURL }/heroes?q=${ query }&attr=superhero&_limit=6`);
  // }

  addHero(hero:Hero):Observable<Hero>{
    // Hero es el el body
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  updateHero(hero:Hero):Observable<Hero>{
    if(!hero.id) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }
  deleteHeroById(id:string):Observable<boolean>{
    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      map(resp => true),
      // Si hay un error, es que no existe y el false es porque no se ha borrado
      catchError(err => of(false) ),
    );
  }
}
