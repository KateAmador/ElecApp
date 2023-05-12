import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { LoginService } from '@services/login.service';
import { Leader } from 'src/app/interfaces/leader.interface';
import { Witness } from 'src/app/interfaces/witnesses.interface';
import { Auth } from '@angular/fire/auth';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  login: boolean = false;
  rol: string = "";
  userName: string = "";
  userLastName: string = '';
  candidateId: string = 'candidatoID';


  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(
    public router: Router,
    private loginService: LoginService,
    private auth: Auth) {

    this.loginService.stateUser().subscribe(res => {
      if (res) {
        console.log('Esta logueado');
        const leaderId = this.auth.currentUser?.uid;
        this.getUserData(leaderId);
        this.rol;
      } else {
        console.log('No esta logueado');
      }
    })
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  logout() {
    this.loginService.logout()
      .then(() => {
        this.router.navigate(['/inicio-sesion']);
      })
      .catch((error: any) => console.log(error));
  }

  getUserData(uid: any) {
    const pathLeader = 'Candidato/candidatoID/Lideres';
    const pathWitness = 'Candidato/candidatoID/Testigos';
    const id = uid;

    this.loginService.getDoc<Leader>(pathLeader, id).subscribe(res => {
      //console.log('datos de Lideres -> ', res);

      if (res) {
        this.rol = res.rol;
        this.userName = res.nombre;
        this.userLastName = res.apellido;
      } else {

        this.loginService.getDoc<Witness>(pathWitness, id).subscribe(res2 => {
          //console.log('datos de Testigos -> ', res2);
          if (res2) {
            this.rol = res2.rol;
            this.userName = res2.nombre;
            this.userLastName = res2.apellido;
          }
        });
      }
    });
  }
}
