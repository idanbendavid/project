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
  private addNewCategorySubject: Subject<ICategory> = new Subject<ICategory>();

  setCategoryId(categoryId: number): void {
    this.categorySubject.next(categoryId);
  }

  categoryIdChange(): Observable<number> {
    return this.categorySubject.asObservable();
  }

  public getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>("categories")
  }

  public addCategories(newCategory: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>("categories/", newCategory)
  }

  setAdminCategoriesTable(newCategory: any): void {
    this.addNewCategorySubject.next(newCategory);
  }

  getAdminCategoriesTable(): Observable<ICategory> {
    return this.addNewCategorySubject.asObservable();
  }



}
