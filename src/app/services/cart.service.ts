import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICart } from '../models/ICart';
import { IProducts } from '../models/IProducts';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  public cart: ICart = {
    cartId: 0,
    dateCreated: '',
    lineItems: []
  };


  public finalPrice = new BehaviorSubject<number>(0);
  currentFinalPrice = this.finalPrice.asObservable();

  updateFinalPrice(finalPrice: number) {
    this.finalPrice.next(finalPrice);
  }

  public getCartOfUser(): Observable<ICart> {
    return this.http.get<ICart>(`http://localhost:8080/carts/`)
  }

  public addCartToUser(newCart: {}): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/carts/`, newCart)

  }


}
