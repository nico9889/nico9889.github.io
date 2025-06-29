import {Component, effect, inject, input, linkedSignal, model, WritableSignal} from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Theme} from '../../services/theme/theme';
import {MatDrawer} from '@angular/material/sidenav';
import {pages} from '../../utils/pages';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    MatIconButton,
    MatButton,
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private theme = inject(Theme);
  readonly sideNav = input.required<MatDrawer>();
  private isOpen: WritableSignal<boolean> = linkedSignal(() => {
    return  false;//!this.theme.isMobile();
  });
  readonly closeMobileSidenav = model<boolean>(false)
  readonly isMobile = this.theme.isMobile;
  protected readonly pages = pages;


  constructor() {
    effect(() => {
      if(this.closeMobileSidenav()){
        this.isOpen.set(false);
      }
    });
    effect(() => {
      const isOpen = this.isOpen();
      const sideNav = this.sideNav();
      sideNav.toggle(isOpen).then((state) => {
        this.closeMobileSidenav.set(state !== "open");
      });
    })
  }

  switchSideNav() {
    this.isOpen.update((isOpen) => !isOpen);
  }

}
