import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  view: [number, number] = [500, 200];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#D4AF5D', '#1A5BD5', '#C7B42C', '#AAAAAA']
  };

  single = [
    {
      "name": "Mujeres",
      "value": 1940000
    },
    {
      "name": "Hombres",
      "value": 1200000
    }
  ];

  viewCard: [number, number] = [500, 200];

  colorSchemeCard: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  singleCard = [
    {
      "name": "Total Votos",
      "value": 1500000
    },
    {
      "name": "Total Votos candidato",
      "value": 400000
    },
  ];

  cardColor: string = '#232837';
  cardTextColor: string = '#212529'

  constructor() {
    //Object.assign(this, { single });
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onSelectCard(event: any) {
    console.log(event);
  }

}
