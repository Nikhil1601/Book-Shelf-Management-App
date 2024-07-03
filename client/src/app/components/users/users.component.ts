import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { identifierName } from '@angular/compiler';




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
  constructor(private authService:AuthService,private toastr: ToastrService,private route: ActivatedRoute,
    private router: Router ){}



  ngOnInit(){
    this.loadUsers()
  }



  updateStatus(_id: any){
    this.uid = _id;
   this.authService.updateUserStatus(this.uid).subscribe({next:(res)=>{
    console.log(res)
    this.uid=""
    this.loadUsers()
    this.toastr.success('User updated sucessfuly','Success')
   },
   error:(err:any)=>{
    this.toastr.error('Failed to update user','An error occured')
    console.log(err);
   }
  })
   
   
  }

  loadUsers(){
    this.authService.getAllUsers().subscribe({next:(res)=>{
      this.user = res.data
      this.role = sessionStorage.getItem('role')
      console.log(this.user)
     
    },
  error:(err:any)=>{
    this.toastr.error('Failed to load users','An error occured')
    console.log(err);
  }})
  }
  
  userByBooks(_id:any,bookcount:any){
    this.uid = _id
    console.log(this.uid);
    sessionStorage.setItem("bookcount",bookcount)
    this.authService.changeUserId(this.uid);
    this.router.navigate([`/bookspage/${this.uid}`])
  }
  

  
}
