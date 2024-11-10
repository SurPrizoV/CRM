import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="auth-container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AuthLayoutComponent {}
