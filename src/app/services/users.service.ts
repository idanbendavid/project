import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { SuccessfullRegisterServerResponse } from '../models/SuccessfullRegisterServerResponse';
import { SuccessfulTokenVerificationServerResponse } from '../models/SuccessfulTokenVerificationServerResponse';
import { IUser } from '../models/IUser';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public userType: string | undefined;
  public firstName: string | undefined;
  public token: string | undefined;
  public userId: number | undefined


  constructor(private http: HttpClient) {}

  public getDataOfUser(): Observable<IUser[]>{
    return this.http.get<IUser[]>("http://localhost:8080/users")
  }

  public login(userLoginDetails: UserLoginDetails): Observable<SuccessfulLoginServerResponse> {
    return this.http.post<SuccessfulLoginServerResponse>("http://localhost:8080/users/login", userLoginDetails);
  }

  public createUser(userLoginDetails: UserLoginDetails): Observable<SuccessfullRegisterServerResponse> {
      return this.http.post<SuccessfullRegisterServerResponse>("http://localhost:8080/users/", userLoginDetails);
  }

  public verifyToken(): Observable<SuccessfulTokenVerificationServerResponse> {
    return this.http.get<SuccessfulTokenVerificationServerResponse>("http://localhost:8080/users/verify_token");
}

}
