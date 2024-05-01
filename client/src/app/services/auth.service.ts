import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
    private baseUrl = 'http://localhost:3000';
    private token: string = "";
    username:string = ''
  
    constructor(private http: HttpClient, private router: Router) { }
  
    login(credentials: { email: string, password: string }) {
      return this.http.post<any>(`${this.baseUrl}/user/login`, credentials).pipe(
        tap(response => {
          if (response && response.token) {
            this.token = response.token;
            localStorage.setItem('token', this.token);
          }
        })
      );
    }
    

    register(userDetails: { name: string, email: string, password: string }): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/user/`, userDetails);
    }
  
    logout(): void {
      this.token = "";
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      console.log('bye bye');
      localStorage.removeItem('numberofbooks')
      
    }
  
    getToken(): string | null {
      console.log(localStorage.getItem('token'));
      
      return localStorage.getItem('token');
    }
  
    isAuthenticated(): boolean {
      return !!this.getToken();
    }
    
    getName(){
      return this.http.get<any>(`${this.baseUrl}/user/`)
    }
  
      
  }

