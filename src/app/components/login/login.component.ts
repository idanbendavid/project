import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLoginDetails } from 'src/app/models/UserLoginDetails';
import { CartService } from 'src/app/services/cart.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginFormGroup = new FormGroup({});
  public emailFormControl = new FormControl();
  public passwordFormControl = new FormControl();

  public userLoginDetails: UserLoginDetails;

  constructor(public usersService: UsersService, private router: Router, private toastr: ToastrService, public cartService: CartService,) {
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
  }


  public moveToRegisterPage() {
    this.router.navigate(["/register"]);
  }


  public login(): void {
    if (!this.emailFormControl.value || !this.passwordFormControl.value) {
      this.toastr.error("Invalid Requset, Field Can't Be Empty")
    }
    else {
      const observable = this.usersService.login(this.loginFormGroup.value);

      observable.subscribe(successfulServerRequestData => {

        localStorage.setItem("token", successfulServerRequestData.token + "");

        this.usersService.userType = successfulServerRequestData.userType;
        this.usersService.firstName = successfulServerRequestData.firstName;
        this.usersService.token = successfulServerRequestData.token;
        this.usersService.userId = successfulServerRequestData.userId;

        if (successfulServerRequestData.userType === "customer") {
          this.toastr.success("Welcome " + successfulServerRequestData.firstName);
          this.router.navigate(["/ourProducts"]);
        }

        if (successfulServerRequestData.userType === "admin") {
          this.toastr.success("Welcome " + successfulServerRequestData.firstName);
          this.router.navigate(["/admin"]);
        }

        this.cartService.updateFinalPrice(0);

      }, serverErrorResponse => {
        this.toastr.error(serverErrorResponse.error.error)
      });
    }
  }

  ngOnInit() {
    this.emailFormControl = new FormControl("", [Validators.required, Validators.email,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]);
    this.passwordFormControl = new FormControl("", Validators.required);

    this.loginFormGroup = new FormGroup({
      email: this.emailFormControl,
      password: this.passwordFormControl
    });
  }

}
