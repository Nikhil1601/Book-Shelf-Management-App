import { Component, EventEmitter } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,MatButtonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  books:any
  dropdownStates: boolean[] = [];
  bookidmap: { [key: number]: string } = {}// for future search option
  
  numberofbooks:string ='';
  p:number = 1
  bookid:string=''
  bookName: string = '';
  bookAuthor: string = '';
  bookImage: string = '';
  bookPages: number = 0;
  bookPrice: number = 0;
  upadteform :FormGroup;
  submitted = false;
  

  constructor(private booksService: BooksService,public dialog: MatDialog,private toastr: ToastrService,private fb: FormBuilder){
    this.upadteform = fb.group({
      name:['', [Validators.required]],
      author:['', [Validators.required]],
      image:['', [Validators.required]],
      pages:['', [Validators.required]],
      price:['', [Validators.required]]
    })
  }

  ngOnInit(){
    this.loadBooks()
  }
  get f(): { [key: string]: AbstractControl } {
    return this.upadteform.controls;
  }

  loadBooks(){
    this.booksService.getAllBooks().subscribe((res)=>{
      console.log(res);
      this.books = res.data
      this.numberofbooks = this.books.length.toString()
      console.log(this.books);
      this.books.forEach((book: any, index: number) => {
        this.bookidmap[index] = book._id;
         
      });
      console.log(this.bookidmap);
      localStorage.setItem('numberofbooks',this.numberofbooks)
    })
    
  }
  saveid(id:string){
    this.bookid = id
    console.log(this.bookid)
    this.booksService.getBookById(this.bookid).subscribe((res) => {
      const book = res.data;
      // this.bookName = book.name;
      // this.bookAuthor = book.author;
      // this.bookImage = book.image;
      // this.bookPages = book.pages;
      // this.bookPrice = book.price;

      this.upadteform.setValue({
        name: book.name,
        author:book.author,
        image:book.image,
        pages: book.pages,
        price:book.price
      })
    })
  }

  
  // loadBooksAndEmitEvent() {
  //   this.loadBooks();
  //   this.loadBooksEvent.emit();
  // }
  
  
  update(){
    this.submitted = true

    if (this.upadteform.invalid) {
      this.toastr.error('Invalid data.', 'Error');
      return;
    }
    const bookval = this.upadteform.value
    const book={
      name: bookval.name,
      author: bookval.author,
      image: bookval.image,
      pages: bookval.pages,
      price: bookval.price
    }
    console.log(book);
    this.booksService.updateBook(book,this.bookid).subscribe((res)=>{
      console.log(res)
      this.toastr.success('Successfully updated book','Success')
      this.loadBooks()
    },(error)=>{
      this.toastr.error('Failed to update the book.', 'Error')
    })
    this.closeModal()
    
  }
  delete(){
    console.log(this.bookid);
    this.booksService.deleteBook(this.bookid).subscribe((res)=>{
      console.log(res);
      
    })
    this.bookid = ''
    this.loadBooks()
    
  }
  toggleDropdown(index: number): void {
    this.dropdownStates[index] = !this.dropdownStates[index];
  }
  closeModal() {
    const modalElement = document.getElementById('updateBookModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
    } else {
      console.warn('Modal element not found. Cannot close programmatically.')}
}
  
}
