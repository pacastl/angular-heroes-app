import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  // Las opciones del menu lateral se podrían poner en un archivo aparte
  public sidebarItems = [
    {label: 'Listado', icon: 'label', url:'./list'},
    {label: 'Añadir', icon:'add', url: './new-hero'},
    {label: 'Buscar', icon:'search', url:'./search'}
  ]
}
