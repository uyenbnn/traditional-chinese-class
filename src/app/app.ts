import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { routeAnimations } from './animations/transitions';
import { IconComponent } from './shared/icon/icon.component';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly currentYear = new Date().getFullYear();
  readonly isMenuOpen = signal(false);
  readonly menuToggleIcon = computed(() => (this.isMenuOpen() ? 'close' : 'menu'));
  readonly menuToggleLabel = computed(() =>
    this.isMenuOpen() ? 'Close primary navigation' : 'Open primary navigation'
  );
  private readonly router = inject(Router);

  prepareRoute(outlet: RouterOutlet): string {
    return outlet.isActivated
      ? ((outlet.activatedRouteData['animation'] as string) ?? '')
      : '';
  }

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    this.closeMenu();
    await this.authService.logout();
    await this.router.navigate(['/learn']);
  }
}
