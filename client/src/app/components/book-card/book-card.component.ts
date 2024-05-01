import { Component, EventEmitter } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,MatButtonModule,FormsModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  books:any
  dropdownStates: boolean[] = [];
  bookidmap: { [key: number]: string } = {}
  // url:any[]=[]
  numberofbooks:string ='';
  p:number = 1
  bookid:string=''
  bookName: string = '';
  bookAuthor: string = '';
  bookImage: string = '';
  bookPages: number = 0;
  bookPrice: number = 0;

  // loadBooksEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private booksService: BooksService,public dialog: MatDialog,private toastr: ToastrService){}

  ngOnInit(){
    this.loadBooks()
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
      this.bookName = book.name;
      this.bookAuthor = book.author;
      this.bookImage = book.image;
      this.bookPages = book.pages;
      this.bookPrice = book.price;})
  }

  
  // loadBooksAndEmitEvent() {
  //   this.loadBooks();
  //   this.loadBooksEvent.emit();
  // }
  
  
  update(){
    
    const book={
      name: this.bookName,
      author: this.bookAuthor,
      image: this.bookImage,
      pages: this.bookPages,
      price: this.bookPrice
    }
    console.log(book);
    this.booksService.updateBook(book,this.bookid).subscribe((res)=>{
      console.log(res)
      this.toastr.success('Successfully updated book','Success')
    })
    this.loadBooks()
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
  
}
