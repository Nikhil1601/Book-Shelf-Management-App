import { Component, ViewChild } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../services/books.service';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [BookCardComponent,NavbarComponent,NgxLoadingModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.css'
})
export class BooksPageComponent {
  createform:FormGroup
  submitted=false
  public loading = false;
  @ViewChild (BookCardComponent) private bookcard!: BookCardComponent 
   constructor(private fb:FormBuilder,private bookservice:BooksService,private toastr: ToastrService) 
    
   {
    this.createform = fb.group({
      name:['', [Validators.required]],
      author:['', [Validators.required]],
      image:['', [Validators.required]],
      pages:['', [Validators.required]],
      price:['', [Validators.required]]
    })
   }
  
    

    ngOnInit(){
    }
    get f(): { [key: string]: AbstractControl } {
      return this.createform.controls;
    }
    create(){
      console.log('hello');
      
      this.submitted = true
  
      if (this.createform.invalid) {
        this.toastr.error('Invalid data.', 'Error');
        return;
      }
  
      
      const bookval = this.createform.value
      const book={
        name: bookval.name,
        author: bookval.author,
        image: bookval.image,
        pages: bookval.pages,
        price: bookval.price
      }
      console.log(book);
      
      this.bookservice.createBook(book).subscribe((res)=>{
        console.log(res);
        this.loading = true;
        setTimeout(()=>{
          this.loading = false
          this.bookcard.loadBooks(1)
        },1900)
        
        this.toastr.success('Book created','Success')
      },(error)=>{
        this.loading = false;
        this.toastr.error('Failed to create the book.', 'Error');
      })
      this.closeModal()
      
    }
    
    closeModal(){
      const modal = document.getElementById('addBookModal');
        if (modal) {
          const modalCloseButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (modalCloseButton) {
            modalCloseButton.dispatchEvent(new Event('click'));
          } else {
            console.warn('Close button not found. Cannot close modal programmatically.');
          }
        } else {
          console.warn('Modal element not found. Cannot close modal programmatically.');
        }
      }
  

   
}
