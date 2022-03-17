import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public usersService: UsersService, private router: Router, private toastr: ToastrService, public cityService: CityService, public cartService: CartService) { }

  public isShown = false;

  public registerFormGroup = new FormGroup({});
  public globalIdFormControl = new FormControl(0);
  public emailFormControl = new FormControl("", Validators.email);
  public passwordFormControl = new FormControl("");
  public validatePasswordFormControl = new FormControl("");
  public firstNameFormControl = new FormControl("");
  public lastNameFormControl = new FormControl("");
  public cityFormControl = new FormControl("");
  public streetFormControl = new FormControl("");


  public addCartToUser() {
    let newCart = {};

    let observable = this.cartService.addCartToUser(newCart);
    console.log(this.usersService.userId);
    console.log(this.usersService.firstName);
    console.log(this.usersService.userType);

    observable.subscribe((response) => {

    }, error => { this.toastr.error(error.error) })
  }

  onContinueClicked() {
    if (this.globalIdFormControl.value === 0 || this.globalIdFormControl.value > 999999999|| this.emailFormControl.value === "" || this.passwordFormControl.value === "") {
      this.toastr.error("Invalid Request, check enterend values");
      return
    }
    else {
      this.isShown = true;
    }
  }


  public completeRegistration() {

    if (this.firstNameFormControl.value === "" || this.lastNameFormControl.value === ""
      || this.cityFormControl.value === "" || this.streetFormControl.value === "") {
      this.toastr.error("Invalid Request, Fields Can't Be Empty");
    }
    else {
      const observable = this.usersService.createUser(this.registerFormGroup.value);

      observable.subscribe(successfulServerRequestData => {

        if (successfulServerRequestData.token) {

          localStorage.setItem("token", successfulServerRequestData.token);

          this.usersService.userType = successfulServerRequestData.newUser.userType;
          this.usersService.firstName = successfulServerRequestData.newUser.firstName;
          this.usersService.token = successfulServerRequestData.token;
          this.usersService.userId = successfulServerRequestData.registerUser.insertId;

          this.router.navigate(["/ourProducts"]);

          this.addCartToUser();

        }

      }, serverErrorResponse => {
        this.toastr.error(serverErrorResponse.error.error)
      });
    }
  }


  ngOnInit() {

    this.globalIdFormControl = new FormControl(0,Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)]));
    this.emailFormControl = new FormControl("", Validators.compose([Validators.required, Validators.email]));
    this.passwordFormControl = new FormControl("", Validators.required);
    this.firstNameFormControl = new FormControl("", Validators.required);
    this.lastNameFormControl = new FormControl("", Validators.required);
    this.cityFormControl = new FormControl("", Validators.required);
    this.streetFormControl = new FormControl("", Validators.required);


    this.registerFormGroup = new FormGroup({
      globalId: this.globalIdFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      city: this.cityFormControl,
      street: this.streetFormControl
    })
  }

}
