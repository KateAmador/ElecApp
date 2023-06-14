import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '@services/reports.service';
import { PlaceService } from '@services/place.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  @ViewChild('formRef') formRef: any;
  createReport: FormGroup;
  places: any[] = [];
  selectedPlace: any;
  time: string = '';
  tables: any[] = [];
  tableData: any[] = [];
  showError: boolean = false;

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
  }

  ngOnInit() {
    this.getPlaces();
  }

  getPlaces() {
    this.placeService.getPlaces().subscribe((data: any) => {
      this.places = data;
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


