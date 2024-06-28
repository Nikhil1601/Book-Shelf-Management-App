import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../services/books.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user:any
  noOfBooks:any
  noOfUsers:any
  role = sessionStorage.getItem('role')
  constructor(private authService:AuthService,private router:Router,private bookservice :BooksService){}
  ngOnInit(){
    this.userdetails()
    
  }
  userdetails(){
    this.authService.getName().subscribe((res)=>{
      this.user = res
      this.role = res.role
      console.log(this.role)
      this.userbooks()
  })
  
}
  
 userbooks(){
  
  this.bookservice.getNumberOfBooks().subscribe((res)=>{
    this.noOfBooks = res.count;
    console.log(this.noOfBooks);
    
    sessionStorage.setItem('noOfBooks',this.noOfBooks)
    if(this.role === "admin"){
      this.noofusers()
    }
  })
 }

 noofusers(){
  this.authService.getNumberOfUsers().subscribe((res)=>{
    this.noOfUsers = res.ucount;
    console.log(this.noOfUsers);
    sessionStorage.setItem('numOfUsers',this.noOfUsers)
  })
 }
}
