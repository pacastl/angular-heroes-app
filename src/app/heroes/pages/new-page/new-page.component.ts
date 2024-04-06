import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  //Formualrio reactivo
  public heroForm = new FormGroup(
    {
      id:               new FormControl<string>(''),
      superhero:        new FormControl<string>('', {nonNullable:true}),
      publisher:        new FormControl<Publisher>(Publisher.DCComics),
      alter_ego:        new FormControl(''),
      first_appearance: new FormControl(''),
      characters:       new FormControl(''),
      alt_img:         new FormControl(''),
    });

  public publishers=[
    { id :'DC Comics',desc: 'DC - Comics'},
    { id :'Marvel Comics',desc: 'Marvel - Comics'},
  ];

  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbar:MatSnackBar,
    private dialog:MatDialog
    ){}
  ngOnInit(): void {
    // La url es distinta si estamos editando o añadiendo un héroe y lo podemos usar de referencia
    if(!this.router.url.includes('edit')) return;

    // Estamos en editar
     this.activatedRoute.params
     .pipe(
      switchMap( ({id}) => this.heroesService.getHeroById(id) ),
     ).subscribe(hero => {
      // El héroe no existe
      if(!hero) return this.router.navigateByUrl('/');

      // Reset tiene doble función: reinicia el formulario para que vuelva a su valor original y si le pasamos un argumento, en este caso héroe
      // asigna automáticamente los valores a los campos en losqueel nombre coincide
      this.heroForm.reset(hero);
      return;
     });
  }
  get currentHero():Hero{
    // Si no ponemos as Hero da error por pasarlo directamente del formulario
    const hero=this.heroForm.value as Hero;

    return hero;
  }

  onSubmit():void{
    // formulario no válido= no hace nada
    if(this.heroForm.invalid) return;

    /* Falla porque no admite que le pasemos un heroe directamente con los valores del formulario
     this.heroesService.updateHero(this.heroForm.value);
    */

     if(this.currentHero.id){
      // Hay que disparar el observabe con subscribe siempre
      this.heroesService.updateHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar(`${hero.superhero} updated`)
      });
      return;
     }
     this.heroesService.addHero(this.currentHero)
     .subscribe( hero => {
      this.router.navigate(['/heroes/edit',hero.id]);
      this.showSnackbar(`${hero.superhero} created!`);
     });
  }

  onDeleteHero() {
    // Si no existe el id (por si acaso)
    if (!this.currentHero.id) throw Error('Hero is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });


    dialogRef.afterClosed()
      .pipe(
        // Si es un resultado postivo, le deja pasar
        filter( (result:boolean) => result),
        switchMap( () =>this.heroesService.deleteHeroById(this.currentHero.id)),
        filter( (wasDeleted:boolean) => wasDeleted),
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
      })

    //No está mal pero se puee mejorar la lectura

    // dialogRef.afterClosed().subscribe(result => {
    //   // Si tenemos un flase o undefined
    //   if(!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //   .subscribe( wasDeleted => {
    //     if(wasDeleted)
    //     this.router.navigate(['/heroes']);
    //   });
    //   this.router.navigate(['/heroes']);
    // });
  }
  showSnackbar(message: string):void{
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }
}
