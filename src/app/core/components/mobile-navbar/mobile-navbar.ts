import {Component, input} from '@angular/core';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';
import {pages} from '../../utils/pages';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-mobile-navbar',
  imports: [
    MatTabNav,
    RouterLink,
    MatIcon,
    MatTabLink
  ],
  templateUrl: './mobile-navbar.html',
  styleUrl: './mobile-navbar.scss'
})
export class MobileNavbar {
  readonly panel = input.required<MatTabNavPanel>();

  protected readonly pages = pages;
  link: string;

  constructor() {
    this.link = pages[0]?.route;
  }
}
