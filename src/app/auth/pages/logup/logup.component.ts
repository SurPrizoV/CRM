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
import { User, UserData } from '../../../shared/interfaces';
import { AuthService } from '../../services/auth.service';
import { manager } from '../../../shared/links';

@Component({
  selector: 'app-logup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './logup.component.html',
  styleUrl: './logup.component.scss',
})
export class LogupComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
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
      const { name, surname, email, password } = this.form.value;
      const user: User = {
        email,
        password,
        returnSecureToken: true,
      };
      const userData: UserData = {
        email,
        name,
        surname,
        img: manager.avatar,
      };

      this.authService.logup(user).subscribe({
        next: (response) => {
          this.authService
            .saveUserData(response?.localId!, userData)
            .subscribe();
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
