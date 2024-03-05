import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  loginFormGroup: FormGroup = new FormGroup({
    'email': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigateByUrl('blog');
    }
  }

  login(): void {
    this.authService.login(this.loginFormGroup.value)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('blog');
        },
        error: () => {
          this.loginFormGroup.setErrors({ 'invalid': true });
        }
      });
  }
}
