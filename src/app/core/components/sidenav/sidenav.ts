import { Component } from '@angular/core';
import {ThemeSwitch} from '../theme-switch/theme-switch';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-sidenav',
  imports: [
    ThemeSwitch,
    MatDivider
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {

}
