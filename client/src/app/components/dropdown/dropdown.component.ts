import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  user:any
  constructor(private authService:AuthService,private toastr:ToastrService,private router: Router){}
  usernameSelected:string = "Choose username"

  ngOnInit(){
    this.loadUsernames()
    
  }



  loadUsernames(){
    this.authService.getUsernameandId().subscribe({next:(res)=>{
      this.user = res.data
      // console.log("hello there",this.user)
    },
    error:(err:any)=>{
      this.toastr.error('Failed to load books','An error occured')
      console.log(err);
  }
  })
  }


  openbooks(_id:any,username:string){
    this.usernameSelected = username
    this.router.navigate([`/bookspage/${_id}`])
    this.authService.changeUserId(_id);
  }




}
