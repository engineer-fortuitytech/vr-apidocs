import { Injectable } from '@angular/core';

const THEME_KEY = 'appetite-theme';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class Theme {

  private current: ThemeMode;

  constructor() {
    this.current = this.loadInitialTheme();
    this.applyTheme(this.current);
  }

  get currentTheme(): ThemeMode {
    return this.current;
  }

  isDark(): boolean {
    return this.current === 'dark';
  }

  toggle(): void {
    const next: ThemeMode = this.current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(mode: ThemeMode): void {
    this.current = mode;
    localStorage.setItem(THEME_KEY, mode);
    this.applyTheme(mode);
  }

  private loadInitialTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // fallback: system preference
    if (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'dark'; // default
  }

  private applyTheme(mode: ThemeMode): void {
    const root = document.documentElement; // <html>
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
  
}
