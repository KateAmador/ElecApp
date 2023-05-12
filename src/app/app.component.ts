import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sidenav';

  constructor(
    private router: Router) { }

  isSideNavCollapsed = false;
  screenWidth = 0;

  pages(): boolean {
    return this.router.url === '/inicio-sesion' || this.router.url === '/recuperar';
  }

  isLoginPage(): boolean {
    return this.router.url === '/inicio-sesion';
  }

  isResetPage(): boolean {
    return this.router.url === '/recuperar';
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
