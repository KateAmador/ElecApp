import { Component, OnInit } from '@angular/core';
import { DocumentData, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { SearchService } from '@services/search.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Chart } from 'chart.js/auto';
import { Observable, forkJoin, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  genre: string = '';
  result: number | null = null;
  totalMan: number = 0;
  totalWomen: number = 0;
  ageRanges: any[] = [];
  updateAgeRangesCompleted = false;

  //----------Grafica genero----------//

  single: any[] = [];

  //options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;

  colorScheme: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#D4AF5D', '#1A5BD5', '#C7B42C', '#AAAAAA']
  };


  constructor(private searchService: SearchService) {
    Object.assign(this, {});
  }

  async ngOnInit() {
    this.getGender();
    this.getUsersAges();
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
      const totalMenSupporters = await this.searchService.searchForGender('Hombre');
      const totalWomenSuporters = await this.searchService.searchForGender('Mujer');
      const totalMenLeaders = await this.searchService.searchForLeaderGender('Hombre');
      const totalWomenLeaders = await this.searchService.searchForLeaderGender('Mujer');

      this.single = [
        {
          "name": "Mujeres",
          "value": totalWomenSuporters + totalWomenLeaders
        },
        {
          "name": "Hombres",
          "value": totalMenSupporters + totalMenLeaders
        }
      ];

      this.totalMan = totalMenSupporters + totalMenLeaders;
      this.totalWomen = totalWomenSuporters + totalWomenLeaders;
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  }

  async getUsersAges() {
    return new Promise<void>((resolve) => {
      this.ageRanges = [
        { start: 18, end: 25, count: 0 },
        { start: 26, end: 35, count: 0 },
        { start: 36, end: 45, count: 0 },
        { start: 46, end: 55, count: 0 },
        { start: 56, end: 65, count: 0 },
        { start: 66, end: 75, count: 0 },
        { start: 76, end: 100, count: 0 }
      ];

      this.searchService.getUsersAges().subscribe((candidateSnapshot) => {
        const promises: Promise<QuerySnapshot<DocumentData>>[] = [];

        candidateSnapshot.forEach((candidateDoc) => {
          const leadersCollection = candidateDoc.ref.collection('Lideres');
          promises.push(leadersCollection.get());

          const leaderPromises: Promise<QuerySnapshot<DocumentData>>[] = [];
          leadersCollection.get().then((leaderSnapshot) => {
            leaderSnapshot.forEach((leaderDoc) => {

              const followersCollection = leaderDoc.ref.collection('Seguidores');
              leaderPromises.push(followersCollection.get());
              const birthDate = leaderDoc.data()['fechaNacimiento'];
              const age = this.calculateAge(birthDate);
              this.updateAgeRangeCount(age);
            });
            return Promise.all(leaderPromises);

          }).then((followerSnapshots) => {
            followerSnapshots.forEach((followerSnapshot) => {
              followerSnapshot.forEach((followerDoc) => {
                const birthDate = followerDoc.data()['fechaNacimiento'];
                const age = this.calculateAge(birthDate);
                this.updateAgeRangeCount(age);
              });
            });

            this.createAgeChart();
            resolve();
          });
        });

        Promise.all(promises).then(() => {
          this.createAgeChart();
          resolve();
        });
      });
    });
  }



  calculateAge(dateString: string) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  updateAgeRangeCount(age: number) {
    for (const range of this.ageRanges) {
      if (age >= range.start && age <= range.end) {
        range.count++;
        break;
      }
    }
  }

  createAgeChart() {
    const ageLabels = this.ageRanges.map(range => `${range.start}-${range.end}`);
    const ageCounts = this.ageRanges.map(range => range.count);

    const ctx = document.getElementById('ageChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const ageChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ageLabels,
        datasets: [{
          label: 'Edades',
          data: ageCounts,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value.toString();
                }
                return '';
              }
            }
          }
        }
      }
    });
  }


}
