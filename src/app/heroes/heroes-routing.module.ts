import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';

const routes: Routes = [
  {
    // localhost:4200/heroes/''
    path:'',
    component: LayoutPageComponent,
    // Rutas hijas dentro de /heroes/
    children: [
      {path:'new-hero',component:NewPageComponent},
      {path:'search',component:SearchPageComponent},
      {path:'edit/:id',component:NewPageComponent},
      {path:'list',component:ListPageComponent},

      // IMP ponerlo al final porque sino entra siempre aquí
      {path:':id',component:HeroPageComponent},

      // Entra la priemra vez, es decir cuando es ''
      {path:'**',redirectTo:'list'},


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
