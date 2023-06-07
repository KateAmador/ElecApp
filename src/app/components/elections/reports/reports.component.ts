import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '@services/reports.service';
import { PlaceService } from '@services/place.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  createReport: FormGroup;
  places: any[] = [];
  selectedPlace: any;
  time: string = '';
  tables: any[] = [];
  textTime: string = '';
  tableData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportsService,
    private datePipe: DatePipe,
    private placeService: PlaceService) {

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
      const sortedData = Object.keys(data).sort().map((key, index) => ({
        mesa: `Mesa ${index + 1}`,
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
    this.textTime = 'Guardado a las';

    for (let i = 0; i < this.tables.length; i++) {
      const table = this.tables[i];

      if (table.numeroVotos !== null) {
        this.reportService.addReport(
          placeId,
          `mesa${table.mesa}`,
          table.mesa,
          table.numeroVotos,
          this.time
        );
      }
    }
    this.createReport.reset();
  }

}
