import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'traditional-chinese-class-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<ThemeMode>('light');
  readonly isDark = computed(() => this.theme() === 'dark');
  readonly toggleLabel = computed(() =>
    this.isDark() ? 'Switch to light mode' : 'Switch to dark mode'
  );
  readonly toggleText = computed(() =>
    this.isDark() ? 'Light mode' : 'Dark mode'
  );
  readonly toggleIcon = computed(() =>
    this.isDark() ? 'light_mode' : 'dark_mode'
  );

  constructor() {
    const initialTheme = this.readStoredTheme() ?? this.detectSystemTheme();
    this.applyTheme(initialTheme, false);
  }

  toggleTheme(): void {
    this.applyTheme(this.isDark() ? 'light' : 'dark');
  }

  private applyTheme(theme: ThemeMode, persist = true): void {
    this.theme.set(theme);

    const root = this.document.documentElement;
    root.dataset['theme'] = theme;
    root.style.colorScheme = theme;

    if (!persist || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private readStoredTheme(): ThemeMode | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : null;
  }

  private detectSystemTheme(): ThemeMode {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}