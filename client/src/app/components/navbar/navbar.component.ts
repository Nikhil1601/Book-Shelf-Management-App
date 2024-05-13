import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user:any
  constructor(private authService: AuthService){}

  ngOnInit(){

    this.authService.getName().subscribe((res)=>{
      this.user = res
      console.log(this.user);
    })
  }
  logout(){
    const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
    this.authService.logout()
  }
}
