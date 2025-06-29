import {Component, computed, inject, signal} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {Sidenav} from '../sidenav/sidenav';
import {RouterOutlet} from '@angular/router';
import {MatTabNavPanel} from '@angular/material/tabs';
import {MobileNavbar} from '../mobile-navbar/mobile-navbar';
import {Theme} from '../../services/theme/theme';

@Component({
  selector: 'app-main',
  imports: [
    Navbar,
    MatDrawerContainer,
    MatDrawerContent,
    Sidenav,
    RouterOutlet,
    MatTabNavPanel,
    MobileNavbar,
    MatDrawer
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  private theme = inject(Theme);
  readonly isMobile = this.theme.isMobile;
  readonly drawerMode = computed(() => {
    return (this.isMobile()) ? 'over' : 'side';
  });

  readonly touchStart = signal<number>(0);
  readonly closeMobileSidenav = signal<boolean>(false);


}
