import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string ='';
  submitted = false;
  formlogin:FormGroup
  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder) {
    this.formlogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
    });
   }
   get f(): { [key: string]: AbstractControl } {
    return this.formlogin.controls;
  }
  login() {
    this.submitted = true;
    if (this.formlogin.invalid) {
      return;
    }
    console.log(`Login: ${this.formlogin.value.email} / ${this.formlogin.value.password}`);
    this.authService.login({
      email: this.formlogin.value.email,
      password: this.formlogin.value.password,
    }).subscribe(() => {
      // alert('Login success!');
      console.log('success login');
      
      this.router.navigateByUrl('/home')
    }, (error) => {
      if (error.status === 404) {
        this.errorMessage = 'User not found.';
      } else if (error.status === 401) {
        this.errorMessage = 'Invalid password.';
      } else {
        this.errorMessage = 'An unexpected error occurred.';
      }});
  }

}
