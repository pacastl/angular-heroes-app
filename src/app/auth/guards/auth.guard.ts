import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap, pipe } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const canActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return checkAuthStatus();
};

export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return checkAuthStatus();
};
const checkAuthStatus = (): boolean | Observable<boolean> => {

  // No es necesario tener un constructor ya que se está inyectando por defecto el AuthService y el Router
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

// El isAuthenticated es la variable que retorna el pipe y con la cual se realizarán las validaciones respectivas para hacer la navegación a la página del login.
  return authService.checkAuthentication()
          .pipe(
            // Si está autenticado lo redirigimos
            tap(isAuthenticated => {
              // si no está autenticado lo redirigimos al login
              if(!isAuthenticated) router.navigate(['/auth/login'])
            })
          );
};
