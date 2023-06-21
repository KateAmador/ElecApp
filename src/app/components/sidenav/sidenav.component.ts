import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { LoginService } from '@services/login.service';
import { Leader } from 'src/app/interfaces/leader.interface';
import { Witness } from 'src/app/interfaces/witnesses.interface';
import { Auth } from '@angular/fire/auth';
import { Users } from 'src/app/interfaces/users.interface';


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
  isExpanded: boolean = false;


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
        const user = this.auth.currentUser?.uid;
        this.getUserData(user);
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
    this.isExpanded = true;
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    this.isExpanded = false;
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
    const pathAdmin = 'Usuarios';
    const id = uid;

    this.loginService.getDoc<Leader>(pathLeader, id).subscribe(resLeader => {
      if (resLeader) {
        this.rol = resLeader.rol;
        this.userName = resLeader.nombre;
        this.userLastName = resLeader.apellido;
        this.filterMenuByUserRole();
      } else {
        this.loginService.getDoc<Witness>(pathWitness, id).subscribe(resWitness => {
          if (resWitness) {
            this.rol = resWitness.rol;
            this.userName = resWitness.nombre;
            this.userLastName = resWitness.apellido;
            this.filterMenuByUserRole();
          } else {
            this.loginService.getDoc<Users>(pathAdmin, id).subscribe(resAdmin => {
              if (resAdmin) {
                this.rol = resAdmin.rol;
                this.userName = resAdmin.nombre;
                this.userLastName = resAdmin.apellido;
                this.filterMenuByUserRole();
              }
            });
          }
        });
      }
    });
  }

  filterMenuByUserRole() {
    const userRole = this.rol;
    console.log('User Role:', userRole);

    this.navData = navbarData.filter(data => {
      if (!data.requiredRole) {
        return true;
      }

      const isAdmin = userRole === 'admin';
      const isLider = userRole === 'lider';
      const isTestigo = userRole === 'testigo';

      if (isAdmin) {
        return true;
      }

      if (isLider) {
        if (data.routeLink === 'inicio' || data.routeLink === 'candidato') {
          return true;
        }
        if (data.routeLink === 'campaña' && data.items) {
          const filteredItems = data.items.filter(item => item.routeLink === 'campaña/seguidores');
          data.items = filteredItems;
          return filteredItems.length > 0;
        }
      }

      if (isTestigo) {
        if (data.routeLink === 'inicio' || data.routeLink === 'candidato') {
          return true;
        }
        if (data.routeLink === 'elecciones' && data.items) {
          const filteredItems = data.items.filter(item => item.routeLink === 'elecciones/reportes');
          data.items = filteredItems;
          return filteredItems.length > 0;
        }
      }

      return false;
    });
  }
}
