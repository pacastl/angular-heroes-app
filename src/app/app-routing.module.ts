import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { canActivateGuard, canMatchGuard } from './auth/guards/auth.guard';
import { canActivateGuardPublic, canMatchGuardPublic } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path:'auth',
    // Lazyload
    loadChildren: () => import ('./auth/auth.module').then(m =>m.AuthModule),
    canActivate: [canActivateGuardPublic],
    canMatch: [canMatchGuardPublic]
  },
  {
    path: 'heroes',
    // Lazyload
    loadChildren: () => import ('./heroes/heroes.module').then(m =>m.HeroesModule),
    // Bloqueamos la ruta si no está autenticado
    canActivate: [canActivateGuard],
    canMatch: [canMatchGuard]
  },
  {
    path:'404',
    component:Error404PageComponent
  },
  {
    path:'',
    redirectTo: 'heroes',
    // IMP ponerlo porque sino entra siempre aquí debido a que entre cada
    // letra de las rutas hay un espacio--> ejemplo: 'auth' ,
    // entre la 'a' y la 'u' detecta un "espacio"
    pathMatch:'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
