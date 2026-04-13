import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { routeAnimations } from './animations/transitions';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  prepareRoute(outlet: RouterOutlet): string {
    return outlet.isActivated
      ? ((outlet.activatedRouteData['animation'] as string) ?? '')
      : '';
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/learn']);
  }
}
