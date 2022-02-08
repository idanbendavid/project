import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ICategory } from '../models/ICategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }
  
  private categorySubject: Subject<number> = new Subject<number>();

  setCategoryId(categoryId: number): void {
    this.categorySubject.next(categoryId);
  }

  categoryIdChange(): Observable<number> {
    return this.categorySubject.asObservable();
  }

  public getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>("http://localhost:8080/categories")
  }

  public addCategories(newCategory: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>("http://localhost:8080/categories/", newCategory)
  }

}
