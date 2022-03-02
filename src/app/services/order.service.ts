import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../models/IOrder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }


  public order(newOrder: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(`orders/`,newOrder )
  }


}
