import {Component, inject, OnInit} from '@angular/core';
import {Main} from './core/components/main/main';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [Main],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private matIconRegistry: MatIconRegistry = inject(MatIconRegistry);

  ngOnInit(): void {
    const defaultFontSetClasses = this.matIconRegistry.getDefaultFontSetClass();
    const outlinedFontSetClasses = defaultFontSetClasses
      .filter((fontSetClass) => fontSetClass !== 'material-icons')
      .concat(['material-symbols-outlined']);
    this.matIconRegistry.setDefaultFontSetClass(...outlinedFontSetClasses);
  }
}
