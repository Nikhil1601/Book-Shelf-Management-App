import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form:FormGroup
  name=''
  email=''
  password=''
  submitted = false;
  errorMessage: string='';

  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder){
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
    });
  }

  
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  signup(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.authService.register({name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password}).subscribe(()=>{
      
      this.router.navigateByUrl('')
    }, (error) => {
      if (error.status === 409) { 
        this.errorMessage = 'User already exists.';
      } else {
        this.errorMessage = 'An unexpected error occurred.';
      }})

  }
}
