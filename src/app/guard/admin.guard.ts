import { Injectable, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  public constructor(private router: Router, private usersService: UsersService) { }

  public canActivate(): boolean {
    const userType = this.usersService.userType;
    if (userType === "admin") {
      return true;
    }

    this.router.navigate(["/**"]);
    return false;
  }

}
