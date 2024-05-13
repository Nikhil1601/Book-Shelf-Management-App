import { Component, EventEmitter, HostListener, ViewChild, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { BooksService } from '../../services/books.service';
import { BooksPageComponent } from '../books-page/books-page.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,DashboardComponent,NavbarComponent,RouterModule,FormsModule,ReactiveFormsModule,NgxLoadingModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user:any
  
  
  constructor(private authService: AuthService,private bookservice:BooksService,private toastr: ToastrService,private fb: FormBuilder,private router:Router){
    
  }
  
  ngOnInit(){
    
  }
  

  
  logout(){
    const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
    this.authService.logout()
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event:Event) {
      if(confirm('You want to logout')){
        this.logout()
      }
      else{
        event.preventDefault()
        history.go(1)
      }
  }
  
}
