import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {
  argbFromHex,
  hexFromArgb,
  Scheme,
  themeFromSourceColor,
  Theme as MaterialTheme, themeFromImage
} from "@material/material-color-utilities";
import {toSignal} from "@angular/core/rxjs-interop";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

export enum ThemeEnum {
  Dark = "dark",
  Light = "light",
  Auto = "auto"
}

@Injectable({
  providedIn: 'root'
})
export class Theme {
  readonly isAutoSupported = signal(false);
  readonly current: WritableSignal<ThemeEnum> = signal(ThemeEnum.Auto);
  readonly isMobile = computed(() => this.isHandset()?.matches || false);
  readonly font: Signal<ThemeEnum> = computed(() => {
    return (this.current() === ThemeEnum.Light) ? ThemeEnum.Dark : ThemeEnum.Light;
  });

  private readonly colorOverride: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  private readonly backgroundImage: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  private readonly season: string;
  private css = new CSSStyleSheet();
  private cssBackground = new CSSStyleSheet();
  private breakpoints = inject(BreakpointObserver);
  private isHandset;
  private matchMediaQueryList: MediaQueryList | undefined = undefined;


  constructor() {
    this.isAutoSupported.set(!!window.matchMedia);
    if (!this.isAutoSupported()) {
      this.current.set(ThemeEnum.Light);
    }else{
      this.matchMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    }
    this.isHandset = toSignal(this.breakpoints.observe(Breakpoints.Handset));
    document.adoptedStyleSheets.push(this.css);
    document.adoptedStyleSheets.push(this.cssBackground);
    this.season = this.getCurrentSeason();

    // setting light/dark theme change effect
    const body = document.body as HTMLBodyElement;
    effect(() => {
      this.matchMediaQueryList?.removeEventListener('change', this.autoThemeChange);
      const current = this.current();
      if (current === ThemeEnum.Dark) {
        body.classList.add('dark-mode');
      } else if (current === ThemeEnum.Light) {
        body.classList.remove('dark-mode');
      } else {
        if(this.matchMediaQueryList?.matches && !body.classList.contains('dark-mode')) {
          body.classList.add('dark-mode');
        }else{
          body.classList.remove('dark-mode');
        }
        this.matchMediaQueryList?.addEventListener('change', this.autoThemeChange);
      }
    });

    // restoring light/dark theme from localStorage
    const saved = localStorage.getItem('nico9889-theme');
    if (saved === ThemeEnum.Dark) {
      this.current = signal(ThemeEnum.Dark);
    } else if (saved === ThemeEnum.Light) {
      this.current = signal(ThemeEnum.Light)
    } else if (saved === ThemeEnum.Auto) {
      this.current = signal(ThemeEnum.Auto);
    }

    // restoring image background from localStorage
    this.restoreBackgroundImage();

    // restoring overriden theme color from localStorage
    this.restoreColor();

    // adding effect to store options to localStorage automagically
    effect(() => {
      localStorage.setItem('nico9889-theme', this.current());
    });
    effect(() => {
      const color = this.colorOverride();
      if (color)
        localStorage.setItem('nico9889-color-override', color);
      else {
        localStorage.removeItem('nico9889-color-override');
      }
    });
    effect(() => {
      const image = this.backgroundImage();
      if (image)
        localStorage.setItem('nico9889-background-image', image);
      else {
        localStorage.removeItem('nico9889-background-image');
      }
    });

    // adding effect to restore seasonal theme if color is not overridden
    effect(() => {
      if (!this.colorOverride()) {
        const date = new Date();
        if (date.getDate() === 25 && date.getMonth() == 12) {
          body.classList.add('xmas');
        } else if (date.getDate() === 31 && date.getFullYear() == 10) {
          body.classList.add('halloween');
        } else {
          body.classList.add(this.season);
        }
      }
    });

    this.setSeasonalAnimations(body);
  }

  private autoThemeChange(event: MediaQueryListEvent) {
    const body = document.body as HTMLBodyElement;
    if (event.matches) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  private getCurrentSeason(): string {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    const season = Math.floor(date.getMonth() / 3) % 4;
    const seasons = ["winter", "spring", "summer", "fall"];
    return seasons[season];
  }

  private restoreBackgroundImage() {
    const image = localStorage.getItem('nico9889-background-image') ?? undefined;
    this.backgroundImage.set(image);
    if (image) {
      this.setImage(image);
    }
  }

  private restoreColor() {
    const color = localStorage.getItem('nico9889-color-override') ?? undefined;
    this.colorOverride.set(color);
    if (color) {
      this.setThemeColor(color);
    }
  }

  // TODO: add option to disable animations
  private setSeasonalAnimations(body: HTMLBodyElement) {
    if (this.season === "winter") {
      body.classList.add('snow');
    }
  }


  private setImage(image: string): void {
    if (this.cssBackground.cssRules.length) {
      this.cssBackground.deleteRule(0);
    }
    this.cssBackground.insertRule(`.background.third{
    background-image:url(${image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position-y: 100%;
    background-position-x: 100%}
    `)
  }

  private setSchemeProperties(
    scheme: { light: Scheme, dark: Scheme },
  ) {
    const dark_obj = scheme.dark.toJSON();
    const rules = ["html{"];
    for (const [key, value] of Object.entries(scheme.light.toJSON())) {
      const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const color = hexFromArgb(value);
      // @ts-ignore
      const dark_color = hexFromArgb(Number(dark_obj[key]))
      rules.push(`--mat-sys-${token}: light-dark(${color}, ${dark_color}) !important;`);
    }
    rules.push("}");
    this.css.insertRule(rules.join("\n"), 0);
  }

  private applyTheme(theme: MaterialTheme) {
    const body = document.body as HTMLBodyElement;
    body.classList.remove(this.season);
    if (this.css.cssRules.length) {
      this.css.deleteRule(0);
    }
    this.setSchemeProperties(theme.schemes);
  }

  switch() {
    const inverseTheme = this.font();
    this.current.set(inverseTheme);
  }

  setThemeColor(color: string) {
    const argb = argbFromHex(color);
    const theme = themeFromSourceColor(argb);
    this.applyTheme(theme);
    this.colorOverride.set(color);
  }

  clearTheme() {
    this.colorOverride.set(undefined);
    if (this.css.cssRules.length > 0)
      this.css.deleteRule(0);
  }

  setBackgroundImage(image: HTMLImageElement) {
    themeFromImage(image).then((theme) => {
      const hex = hexFromArgb(theme.source);
      this.setThemeColor(hex);
      this.colorOverride.set(hex);
      this.backgroundImage.set(image.src);
      this.setImage(image.src);
    });
  }

  clearBackground() {
    this.backgroundImage.set(undefined);
    if (this.cssBackground.cssRules.length > 0)
      this.cssBackground.deleteRule(0);
  }
}
