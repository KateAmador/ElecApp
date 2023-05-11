import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { LoginService } from '@services/login.service';
import { Auth } from '@angular/fire/auth';
import 'firebase/firestore';
import 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import { UsersService } from '@services/users.service';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';


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
  nombreUsuario: string = ' ';

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  candidatoService: any;
  users: any;
  isLoading: boolean | undefined;

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
    private auth: Auth,
    private firestore: Firestore,
    private userService: UsersService,
    // private afAuth: AngularFireAuth,
    // private afs: AngularFirestore
    ) {

    this.loginService.stateUser().subscribe(res => {
      if (res) {
        console.log('Esta logueado');
        //res.uid
      } else {
        console.log('No esta logueado');
      }
    })
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     const uid = user.uid;
    //     const candidatoRef: AngularFirestoreDocument<any> = this.afs.collection('candidato').doc(uid);
    //     candidatoRef.get().subscribe(doc => {
    //       if (doc.exists) {
    //         const data = doc.data();
    //         if (data.testigos) {
    //           const testigoRef: AngularFirestoreDocument<any> = candidatoRef.collection('testigos').doc(uid);
    //           testigoRef.get().subscribe(testigoDoc => {
    //             if (testigoDoc.exists) {
    //               const testigoData = testigoDoc.data();
    //               this.nombreUsuario = testigoData.nombre;
    //             }
    //           });
    //         } else if (data.lideres) {
    //           const liderRef: AngularFirestoreDocument<any> = candidatoRef.collection('lideres').doc(uid);
    //           liderRef.get().subscribe(liderDoc => {
    //             if (liderDoc.exists) {
    //               const liderData = liderDoc.data();
    //               this.nombreUsuario = liderData.nombre;
    //             }
    //           });
    //         }
    //       }
    //     });
    //   }
    // });
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



}
