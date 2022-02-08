import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICity } from '../models/ICity';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  public cities: ICity[] = [{ name: "Tel Aviv" }, { name: "Jerusalem" }, { name: "Haifa" }, { name: "Bat Yam" },{ name: "Beer sheva" },
  { name: "Rishon Lezion" }, { name: "Netanya" }, { name: "Acre" }, { name: "Eilat" }, { name: "Natzeret" }];

}
