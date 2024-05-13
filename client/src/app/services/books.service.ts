import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  getBooks() {
    throw new Error('Method not implemented.');
  }

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllBooks(pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/books?page=${pageNumber}&limit=${pageSize}`;
    return this.http.get<any>(url);
  }

  getBookById(id:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/books/${id}`);
  }

  createBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/books/`, book);
  }

  updateBook( book: any,id:string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/books/${id}`, book);
  }

  deleteBook(id:string): Observable<void> {
    console.log('delete');
    return this.http.delete<any>(`${this.baseUrl}/books/${id}`);
  }

  getNumberOfBooks():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/books/nob`);
  }
}
