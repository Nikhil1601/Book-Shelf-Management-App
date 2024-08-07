import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
    private baseUrl = environment.BASE_URL1;
    private token: string = "";
    username:string = ''
    private role:string = ''
  
    constructor(private http: HttpClient, private router: Router) { }
  
    login(credentials: { email: string, password: string }) {
      return this.http.post<any>(`${this.baseUrl}/user/login`, credentials).pipe(
        tap(response => {
          if (response && response.token) {
            this.token = response.token;
            this.role = response.role;
            sessionStorage.setItem('role',this.role);
            sessionStorage.setItem('token', this.token);
          }
        })
      );
    }
    

    register(userDetails: { name: string, email: string, password: string }): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/user/`, userDetails);
    }
  
    logout(): void {
      this.token = "";
      sessionStorage.removeItem('token');
      console.log('bye bye');
      sessionStorage.removeItem('numberofbooks')
      this.router.navigate(['/login']);
      
    }
  
    getToken(): string | null {
      console.log(sessionStorage.getItem('token'));
      
      return sessionStorage.getItem('token');
    }
  
    isAuthenticated(): boolean {
      return !!this.getToken();
    }
    
    getName(){
      return this.http.get<any>(`${this.baseUrl}/user/`);
    }
  
    getNumberOfUsers(){
      return this.http.get<any>(`${this.baseUrl}/user/nou`);
    }
    getAllUsers(){
      return this.http.get<any>(`${this.baseUrl}/user/allusers`);
    }
    updateUserStatus(uid:any){
      return this.http.put<any>(`${this.baseUrl}/user/updateStatus/${uid}`,{})
    }
    getUsernameandId(){
      return this.http.get<any>(`${this.baseUrl}/user/unameAndId`)
    }

    private userIdSource = new BehaviorSubject<string | null>(null);
  currentUserId = this.userIdSource.asObservable();

  changeUserId(userId: string | null) {
    this.userIdSource.next(userId);
  }
      
  }

