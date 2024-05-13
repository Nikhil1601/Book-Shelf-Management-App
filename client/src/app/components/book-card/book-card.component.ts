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
  totalItems: number = 0;
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
  currentPage: number = 1;
  pgnumber:number = 1
  pageSize = 12
  totalbooks:string =''

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
    this.loadBooks(this.pgnumber)
    this.totalbooks = localStorage.getItem('noOfBooks')!
  }
  get f(): { [key: string]: AbstractControl } {
    return this.upadteform.controls;
  }

  onNext(){
    if(this.pgnumber == Math.ceil(parseInt(this.totalbooks)/this.pageSize)){
      const nextbtn = document.getElementById('nextbtn')
      nextbtn?.setAttribute('disabled','')
      this.toastr.warning("You do not have any more books",'Warning')
    }
    else{
    this.pgnumber ++
    this.loadBooks(this.pgnumber)}
  }
  onPrevious(){
    if(this.pgnumber == 1){
      const prevbtn = document.getElementById('prevbtn')
      prevbtn?.setAttribute('disabled','')
      this.toastr.warning("You can't go back",'Warning')
    }
    else{
    this.pgnumber --
    this.loadBooks(this.pgnumber)}
  }

  loadBooks(pgnumber:number){
    this.booksService.getAllBooks(pgnumber, this.pageSize).subscribe((res) => {
      console.log(res);
      this.books = res.data;
      this.totalItems = res.total;
      console.log(this.books);
      this.books.forEach((book: any, index: number) => {
        this.bookidmap[index] = book._id;
         
      });
      console.log(this.bookidmap);
      
    },(error) => {
        if (error.status === 400) {
          this.toastr.warning('You do not have any more books',"No more books are present")
        }}
  )
    
  }
 
  


  saveid(id:string){
    this.bookid = id
    console.log(this.bookid)
    this.booksService.getBookById(this.bookid).subscribe((res) => {
      const book = res.data;

      this.upadteform.setValue({
        name: book.name,
        author:book.author,
        image:book.image,
        pages: book.pages,
        price:book.price
      })
    })
  }

  
 
  
  
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
      this.bookid = ''
      this.loadBooks(this.pgnumber)
    },(error)=>{
      this.toastr.error('Failed to update the book.', 'Error')
    })
    this.closeModal()
    
  }
  delete(){
    console.log(this.bookid);
    this.booksService.deleteBook(this.bookid).subscribe((res)=>{
      console.log(res);
      this.toastr.success('Successfully deleted','Success')
    },(error)=>{
      this.toastr.error('Not able to delete','Error while deleting')
      console.log(error);
      
    })
    this.bookid = ''
    this.loadBooks(this.pgnumber)
    
  }
  toggleDropdown(index: number): void {
    this.dropdownStates[index] = !this.dropdownStates[index];
  }

closeModal(){
  const modal = document.getElementById('updateBookModal');
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
  

