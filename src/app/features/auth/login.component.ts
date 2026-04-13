import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { errorSlide } from '../../animations/transitions';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [errorSlide],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: [environment.adminCredentials.email, [Validators.required, Validators.email]],
    password: [environment.adminCredentials.password, Validators.required]
  });

  async submit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    const isAuthenticated = await this.authService.login(email, password);

    if (isAuthenticated) {
      await this.router.navigate(['/admin']);
    }
  }
}
