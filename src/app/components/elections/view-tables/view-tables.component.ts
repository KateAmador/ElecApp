import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlaceService } from '@services/place.service';
import { ReportsService } from '@services/reports.service';
import { Observable, map, startWith } from 'rxjs';
import { Place } from 'src/app/interfaces/place.interface';

@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.scss']
})
export class ViewTablesComponent {
  @ViewChild('formRef') formRef: any;
  createReport: FormGroup;
  places: Place[] = [];
  places$!: Observable<Place[]>;
  selectedPlace: any;
  time: string = '';
  tables: any[] = [];
  tableData: any[] = [];
  showError: boolean = false;
  filter = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private reportService: ReportsService,
    private datePipe: DatePipe,
    private placeService: PlaceService
  ) {
    this.createReport = this.fb.group({
      tables: [this.fb.array([]), Validators.required]
    });

    this.selectedPlace = '';

    this.placeService.getPlaces()
      .subscribe((obj: any) => {
        this.places = obj;
        this.places$ = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text))
        );
      },
        (errorData: any) => {

          console.log(errorData);
        }
      );
  }

  ngOnInit() {
    this.getPlaces();
  }

  getPlaces() {
    this.placeService.getPlaces().subscribe((data: any) => {
      this.places = data;
    });
  }

  search(text: any): Place[] {
    return this.places.filter((place: Place) => {
      const term = text.toLowerCase();
      return place.nombre.toLowerCase().includes(term) ||
      place.direccion.toLowerCase().includes(term);
    });
  }

  getTableData(placeId: string) {
    this.reportService.getTableData(placeId).subscribe((data: any) => {
      const sortedData = Object.keys(data).sort().map((key) => ({
        mesa: data[key].mesa,
        votos: data[key].votos,
        hora: data[key].hora
      }));
      this.tableData = sortedData;
    });
  }

  onPlaceChange() {
    const placeId = this.selectedPlace.id;
    this.getTableData(placeId);

    const nTables = this.selectedPlace.numeroMesas;
    this.tables = Array(nTables).fill(null).map((_, index) => ({
      numeroVotos: null,
      hora: null,
      mesa: index + 1
    }));
  }

  addReport() {
    const placeId = this.selectedPlace.id;
    this.time = this.datePipe.transform(new Date(), 'HH:mm') || '';

    let allFieldsFilled = true;

    for (let i = 0; i < this.tables.length; i++) {
      const table = this.tables[i];

      if (table.numeroVotos === null || table.numeroVotos === '') {
        allFieldsFilled = false;
        break;
      }
    }

    if (allFieldsFilled) {
      for (let i = 0; i < this.tables.length; i++) {
        const table = this.tables[i];

        if (table.numeroVotos !== null) {
          const existingVotes = this.tableData[i]?.votos || 0;
          const newVotes = Number(table.numeroVotos);
          const totalVotes = existingVotes + newVotes;

          this.reportService.addReport(
            placeId,
            `mesa${table.mesa}`,
            table.mesa,
            totalVotes,
            this.time
          );
        }
      }

      this.formRef.resetForm();
      this.showError = false;
    } else {
      this.showError = true;
    }
  }

  async editVotesItem(item: any): Promise<void> {
    if (item && item.hasOwnProperty('mesa')) {
      const placeId = this.selectedPlace.id;
      const tableId = `mesa${item.mesa}`;
      console.log(tableId);
      this.time = this.datePipe.transform(new Date(), 'HH:mm') || '';

      if (placeId) {
        const confirmMessage = `¿Estás seguro de modificar los votos de la mesa ${item.mesa}?`;
        const confirmed = window.confirm(confirmMessage);

        if (confirmed) {
          try {
            await this.reportService.editVotes(placeId, tableId, item.votos, this.time);
            console.log(placeId, tableId, item.votos, this.time);
            item.editando = false;
          } catch (error) {
            console.error("Error al guardar los datos:", error);
          }
        }
      } else {
        console.error("No se pudo obtener el ID del lugar seleccionado.");
      }
    } else {
      console.error("No se pudo editar los votos. El objeto item es indefinido o no tiene la propiedad mesa.");
    }
  }


  formatVotes(votes: number): string {
    return votes.toLocaleString();
  }

}
