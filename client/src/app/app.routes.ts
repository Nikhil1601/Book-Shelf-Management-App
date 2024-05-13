import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './services/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { BooksPageComponent } from './components/books-page/books-page.component';



export const routes: Routes = [
    {
        path:'',redirectTo:'login' , pathMatch:'full'
    },
    
    {
        path:'login', component:LoginComponent
    },
    {
        path:'signup',component:SignupComponent
    },
    {
        path:'home',
        component:HomeComponent,canActivate:[authGuard]
    },
    {
        path:'dashboard', component:DashboardComponent ,
        canActivate:[authGuard]
    },
    {
        path:'bookspage',component:BooksPageComponent, canActivate:[authGuard],
        children:[
            {path:'bookcards',component:BookCardComponent},
        ]
    },
    {
        path:'**',component:PagenotfoundComponent
    }
];
