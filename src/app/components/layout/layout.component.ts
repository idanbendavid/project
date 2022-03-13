import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Token } from 'src/app/models/Token';
import { CategoriesService } from 'src/app/services/category.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  private token: Token | any

  constructor(public usersService: UsersService, private router: Router,
    private categoriesService: CategoriesService, private toastr: ToastrService) {
    usersService = this.usersService;
    this.token = new Token();
  }

  public verifyToken(): void {
    const observable = this.usersService.verifyToken();
    observable.subscribe(successfulServerRequestData => {

      this.usersService.userType = successfulServerRequestData.userType;
      this.usersService.firstName = successfulServerRequestData.firstName;
      this.usersService.userId = successfulServerRequestData.userId;

      if (successfulServerRequestData.userType == "customer") {
        this.router.navigate(["/ourProducts"]);
      }

      if (successfulServerRequestData.userType === "admin") {
        this.router.navigate(["/admin"]);
      }

    }, serverErrorResponse => {
      this.toastr.error(serverErrorResponse.error.error)
    });

  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.verifyToken()
    }
    else {
      this.router.navigate(["/login"]);
      this.toastr.info("please login in order to complete your purchase");
    }
  }

}
