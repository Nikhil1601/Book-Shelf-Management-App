import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NavbarComponent,CommonModule,NgxPaginationModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  user:any
  role:any
  uid:any
  constructor(private authService:AuthService){}



  ngOnInit(){
    this.authService.getAllUsers().subscribe((res)=>{
      this.user = res.data
      this.role = sessionStorage.getItem('role')
      console.log(this.user)
      // this.handleBtn()
    })
  }


  // handleBtn(){
  //   let statusbtn:any = document.getElementById('statusBtn')
    
   
  // }

  
  

  saveid(_id: any){
    this.uid = _id;
  }
}
