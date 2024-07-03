import { Component } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';




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
  userId: any | null = null;
  bookcount:any
  constructor(private authService:AuthService, private booksService: BooksService,public dialog: MatDialog,private toastr: ToastrService,private fb: FormBuilder,private route: ActivatedRoute){
    this.upadteform = fb.group({
      name:['', [Validators.required]],
      author:['', [Validators.required]],
      image:['', [Validators.required]],
      pages:['', [Validators.required]],
      price:['', [Validators.required]]
    })
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      const userIdFromRoute = params['uid'];
      this.authService.changeUserId(userIdFromRoute); 
    });
    this.authService.currentUserId.subscribe(userId => {
      this.userId = userId;
      this.loadBooks(this.pgnumber)
    });
   
    this.loadBooks(this.pgnumber)
    this.totalbooks = sessionStorage.getItem('noOfBooks')!
  }

  ngAfterViewInit() {
    const prevbtn = document.getElementById('prevbtn');
    prevbtn?.setAttribute('hidden', '');
    this.loadpagination( )
    }


loadpagination(){
    if(this.userId !== null){
      noBooks = Number(localStorage.getItem("bookcount"))
    }
    else{
    var noBooks = Number(this.numberofbooks)}
    console.log("nosnd",noBooks);
    const pagination = document.getElementById('pagination')
      if(noBooks<=12){
        
        pagination?.setAttribute('hidden','')
      }
      else{
        pagination?.removeAttribute('hidden')
        if(this.pgnumber==1){
          const nextbtn = document.getElementById('nextbtn');
          const prevbtn = document.getElementById('prevbtn');
          nextbtn?.removeAttribute('hidden')
          prevbtn?.setAttribute('hidden','')
        }
      }
}
  get f(): { [key: string]: AbstractControl } {
    return this.upadteform.controls;
  }

  onNext() {
    const totalPages = Math.ceil(parseInt(this.numberofbooks) / this.pageSize);
    this.pgnumber++;
    this.loadBooks(this.pgnumber);
    
    const nextbtn = document.getElementById('nextbtn');
    const prevbtn = document.getElementById('prevbtn');
    
    if (this.pgnumber == totalPages) {
      nextbtn?.setAttribute('hidden', '');
      
    }
    
    if (this.pgnumber > 1) {
      prevbtn?.removeAttribute('hidden');
    }
  }

  onPrevious() {
    const totalPages = Math.ceil(parseInt(this.numberofbooks) / this.pageSize);
    this.pgnumber--;
    this.loadBooks(this.pgnumber);
    
    const prevbtn = document.getElementById('prevbtn');
    const nextbtn = document.getElementById('nextbtn');
    
    if (this.pgnumber == 1) {
      prevbtn?.setAttribute('hidden', '');
      
    }
    
    if (this.pgnumber < totalPages) {
      nextbtn?.removeAttribute('hidden');
    }
  }
  
  

  loadBooks(pgnumber:number){
    this.booksService.getNumberOfBooks().subscribe({next:(res:any)=>{
      this.numberofbooks = res.count
      this.loadpagination()
    }
    })
    

    this.booksService.getAllBooks(pgnumber, this.pageSize,this.userId).subscribe({next:(res:any) => {
      
      console.log(res);
      this.books = res.data;
      this.totalItems = this.books.length;
      console.log(this.totalItems);
      
      
      console.log(this.books);
      this.books.forEach((book: any, index: number) => {
        this.bookidmap[index] = book._id; 
      });
      
      console.log(this.bookidmap); 
      
      
    },
  error:(err:any)=>{
    this.toastr.error('Failed to load books','An error occured')
    console.log(err);
  }
  })
  
  }
 
  


  saveid(id:string){
    this.bookid = id
    console.log("upadte",this.bookid)
    this.booksService.getBookById(this.bookid).subscribe({next:(res:any) => {
      const book = res.data;
      console.log("updateBook",book);
      
      this.upadteform.patchValue({
        name: book.name,
        author:book.author,
        image:book.image,
        pages: book.pages,
        price:book.price
      })
    }})
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
    console.log("update",book);
    this.booksService.updateBook(book,this.bookid).subscribe({next:(res:any)=>{
      console.log(res)
      this.toastr.success('Successfully updated book','Success')
      this.bookid = ''
      this.loadBooks(this.pgnumber)
    },
    error:()=>{
      this.toastr.error('Failed to update the book.', 'Error')
    }
  })
    this.closeModal()
    
  }
  delete(){
    console.log(this.bookid);
    this.booksService.deleteBook(this.bookid).subscribe({next:(res:any)=>{
      console.log(res);
      this.totalItems--;
      console.log(this.totalItems);
      
      this.toastr.success('Successfully deleted','Success')
      this.bookid = ''
      if(this.totalItems==0){
        this.pgnumber--
      }
      this.loadBooks(this.pgnumber)
    },
    error:(error:any)=>{
      this.toastr.error('Not able to delete','Error while deleting')
      console.log(error);
      
    }})
    
    
    

    
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
  

