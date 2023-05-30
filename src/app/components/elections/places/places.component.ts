import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from '@services/place.service';
import { ToastrService } from 'ngx-toastr';
import { Place } from 'src/app/interfaces/place.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent {
  firestore: Firestore = inject(Firestore);
  createPlace: FormGroup;
  places: any[] = [];
  submitted = false;
  loading = false;
  id: string | null;
  tittle: string;
  button: string;
  hasId = false;
  passwordValidators;
  maxDate: string = '';
  itemsPerPage = 10;
  currentPage = 1;

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private location: Location) {

    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.tittle = this.id ? 'Editar Puesto' : 'Crear Puesto';
    this.button = this.id ? 'Editar' : 'Agregar';
    this.passwordValidators = this.id === null ? [Validators.required] : [];

    this.createPlace = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      numeroMesas: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getPlaces();
    this.updatePlace();
    this.unableField();
  }


  async addEdit() {
    this.submitted = true;

    const allFieldsEmpty = Object.values(this.createPlace.value).every(val => val === '');

    if (this.createPlace.invalid || allFieldsEmpty) {
      return;
    }
    if (this.id === null) {
      this.newPlace();
    } else {
      this.update(this.id);
    }
  }

  async newPlace() {
    const place = this.getValues();
    try {
      this.loading = true;

      const response = await this.placeService.addPlace(place);

      this.toastr.success('Guardado Correctamente', 'Puesto');
      this.createPlace.reset();
      this.loading = false;
      console.log(response);

    } catch (error) {

      console.error(error);
      this.loading = false;
      this.toastr.error('Ocurrió un error al guardar', 'Error');
    }
  }

  getPlaces() {
    this.placeService.getPlaces().subscribe(place => {
      this.places = place;
    });
  }

  async deletePlace(place: Place) {
    if (confirm('¿Estás seguro que deseas eliminar el puesto?')) {
      const response = await this.placeService.deletePlace(place);
      this.toastr.success('Se ha eliminado correctamente', 'Puesto');
      console.log(response);
    }
  }

  update(placeId: string) {
    const place = this.getValues();
    this.loading = true;
    this.placeService.updatePlace(placeId, place)
      .then(() => {
        this.loading = false;
        this.createPlace.reset();
        this.router.navigate(['/elecciones/puestos']);
        this.toastr.success('Modificado correctamente', 'Puesto');
      })
      .catch((error) => {
        console.error('Error actualizando puesto: ', error);
        this.loading = false;
      });
  }



  updatePlace() {
    if (this.id !== null) {
      this.loading = true;
      this.placeService.getPlace(this.id).subscribe((data: Place) => {
        this.loading = false;
        this.createPlace.setValue({
          nombre: data.nombre,
          direccion: data.direccion,
          numeroMesas: data.numeroMesas,
        });
      });
    }
  }

  getValues(): Place {
    const place: Place = {
      nombre: this.capitalizeFirstLetter(this.createPlace.value.nombre),
      direccion: this.capitalizeFirstLetter(this.createPlace.value.direccion),
      numeroMesas: this.createPlace.value.numeroMesas,
    };
    return place;
  }

  capitalizeFirstLetter(value: string): string {
    const words = value.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }

  goBack() {
    this.location.back();
  }

  unableField() {
    if (this.aRoute.snapshot.paramMap.has('id')) {
      this.hasId = true;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.places.length / this.itemsPerPage);
  }
}
