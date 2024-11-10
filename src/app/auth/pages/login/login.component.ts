import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  getSymbolLabel(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'символ';
    } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    ) {
      return 'символа';
    } else {
      return 'символов';
    }
  }

  submit() {
    if (this.form.valid) {
      this.submitted = true;
      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['/']);
          this.submitted = false;
        },
        error: () => {
          this.submitted = false;
        },
      });
    }
  }
}
