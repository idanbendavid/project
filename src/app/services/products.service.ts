import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ICategory } from '../models/ICategory';
import { IProducts } from '../models/IProducts';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  constructor(private http: HttpClient) { }

  public getProductsByCategoryId(categoryId: number): Observable<IProducts[]> {
    return this.http.get<IProducts[]>(`http://localhost:8080/categories/${categoryId}`)
  }

  public getAllProducts(): Observable<IProducts[]> {
    return this.http.get<IProducts[]>("http://localhost:8080/products")
  }

  public addProducts(newProduct: IProducts): Observable<IProducts[]> {
    return this.http.post<IProducts[]>("http://localhost:8080/products/", newProduct);
  }

  public editProducts(editedProduct: IProducts): Observable<IProducts[]> {
    return this.http.put<IProducts[]>("http://localhost:8080/products/", editedProduct);
  }
}
