import { Component } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';



@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.css'
})
export class BooksPageComponent {
    bookCardComponent: any;
  
   
  
    

    ngOnInit(){
      

    }

   
}
