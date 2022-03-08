import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICart } from '../models/ICart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private showCartBasedOnWidthSubject = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  public cart: ICart = {
    cartId: 0,
    dateCreated: '',
    lineItems: []
  };

  setCartViewState(showCart: boolean) {
    this.showCartBasedOnWidthSubject.next(showCart);
  }

  getCartViewState(): Observable<boolean> {
    return this.showCartBasedOnWidthSubject.asObservable();
  }


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
