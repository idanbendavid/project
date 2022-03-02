import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IProducts } from '../models/IProducts';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private deletedOneItemSubject = new Subject<number>();
  private deletedAllCartItemsSubject = new Subject<number>();
  private addItemSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  // add item to cart
  public addItemToCart(adddedItem: any): Observable<{}> {
    return this.http.post<{}>(`items/`, adddedItem)
  }

  setAddItemSubject(adddedItem: any): void {
    this.addItemSubject.next(adddedItem);
  }

  getAddOneItemSubject(): Observable<IProducts> {
    return this.addItemSubject.asObservable();
  }


  //  update item quantity
  public updateItemQuantity(updatedItem: any): Observable<IProducts> {
    return this.http.put<IProducts>(`items/`, updatedItem)
  }


  //  delete all items
  public deleteAllItemsFromCart(cartId: number): Observable<IProducts[]> {
    return this.http.delete<IProducts[]>(`items/${cartId}`)
  }

  setDeleteCartItems(cartId: number): void {
    this.deletedAllCartItemsSubject.next(cartId);
  }

  getDeleteCartItems(): Observable<number> {
    return this.deletedAllCartItemsSubject.asObservable();
  }



  // delete one item
  public deleteItemFromCartByCartIdAndProductId(cartId: number, productId: number): Observable<IProducts[]> {
    return this.http.delete<IProducts[]>(`items/${cartId}/${productId}`)
  }

  setDeleteOneItemSubject(productId: number): void {
    this.deletedOneItemSubject.next(productId);
  }

  getDeleteOneItemSubject(): Observable<number> {
    return this.deletedOneItemSubject.asObservable();
  }

}
