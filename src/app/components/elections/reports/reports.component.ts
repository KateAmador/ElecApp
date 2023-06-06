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
    this.reportService.getTableData(placeId).subscribe((data: any[]) => {
      this.tableData = data.map((item, index) => ({
        mesa: `Mesa ${index + 1}`,
        votos: item.votos,
        hora: item.hora
      }));
    });
  }
  onPlaceChange() {
    const placeId = this.selectedPlace.id;
    this.getTableData(placeId);

    const nTables = this.selectedPlace.numeroMesas;
    this.tables = Array(nTables).fill(null).map(() => ({
      numeroVotos: null,
      hora: null
    }));
  }


  addReport() {
    const placeId = this.selectedPlace.id;
    this.time = this.datePipe.transform(new Date(), 'HH:mm') || '';
    this.textTime = 'Guadado a las';

    for (let i = 0; i < this.tables.length; i++) {
      const table = this.tables[i];
      const tableId = `mesa${i + 1}`;

      if (table.numeroVotos !== null) {
        this.reportService.addReport(
          placeId,
          tableId,
          table.numeroVotos,
          this.time
        );
      }
    }
    this.createReport.reset();
  }
}
