import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute) {}

  isSideNavCollapsed = false;
  screenWidth = 0;

  isLoginPage(): boolean {
    return this.router.url === '/inicio-sesion' || this.router.url.includes('/recuperar');
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
