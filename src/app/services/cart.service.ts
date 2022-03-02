import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICart } from '../models/ICart';

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
    return this.http.get<ICart>(`carts/`)
  }

  public addCartToUser(newCart: {}): Observable<any> {
    return this.http.post<any>(`carts/`, newCart)

  }

}
