import {Component, effect, inject, model} from '@angular/core';
import { ThemeEnum as Theme, Theme as ThemeService} from '../../services/theme/theme';
import {MatIcon} from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-theme-switch',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    FormsModule
  ],
  templateUrl: './theme-switch.html',
  styleUrl: './theme-switch.scss'
})
export class ThemeSwitch {
  private theme = inject(ThemeService);
  readonly current = this.theme.current;
  readonly isAutoSupported = this.theme.isAutoSupported;
  readonly Theme = Theme;
  color = model<string>();

  constructor() {
    effect(() => {
      const color = this.color();
      if(color) {
        this.theme.setThemeColor(color);
      }
    })
  }
}
