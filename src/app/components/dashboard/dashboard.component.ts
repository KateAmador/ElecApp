import { Component, OnInit } from '@angular/core';
import { SearchService } from '@services/search.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  view: [number, number] = [500, 200];
  genre: string = '';
  result: number | null = null;
  totalHombres: number = 0;
  totalMujeres: number = 0;

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
      "value": 0
    },
    {
      "name": "Hombres",
      "value": 0
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

  constructor(private searchService: SearchService) {
    //Object.assign(this, { single });
  }
  async ngOnInit() {
    this.showGender();
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

  async getGender(): Promise<void> {
    try {
      const totalHombres = await this.searchService.searchForGender('Hombre');
      const totalMujeres = await this.searchService.searchForGender('Mujer');

      this.single = [
        {
          "name": "Mujeres",
          "value": totalMujeres
        },
        {
          "name": "Hombres",
          "value": totalHombres
        }
      ];

      this.totalHombres = totalHombres;
      this.totalMujeres = totalMujeres;
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  }

  async showGender(): Promise<void> {
    try {
      await this.getGender();
      console.log('Total de hombres:', this.totalHombres);
      console.log('Total de mujeres:', this.totalMujeres);
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  }

  //Busqueda por genero

  // searchGender(): void {
  //   this.searchService.searchForGender(this.genre)
  //     .then((total) => {
  //       this.result = total;
  //     })
  //     .catch((error) => {
  //       console.error('Error al buscar:', error);
  //     });
  // }
}
