import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CityService } from 'src/app/services/city.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public usersService: UsersService, private router: Router, private toastr: ToastrService, public cityService: CityService) { }

  public isShown = false;

  public registerFormGroup = new FormGroup({});
  public globalIdFormControl = new FormControl("");
  public emailFormControl = new FormControl("", Validators.email);
  public passwordFormControl = new FormControl("");
  public validatePasswordFormControl = new FormControl("");
  public firstNameFormControl = new FormControl("");
  public lastNameFormControl = new FormControl("");
  public cityFormControl = new FormControl("");
  public streetFormControl = new FormControl("");


  onContinueClicked() {
    if (this.globalIdFormControl.value === 0 || this.emailFormControl.value === "" || this.passwordFormControl.value === "") {
      this.toastr.error("Invalid Request, Fields Can't Be Empty");
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

        if (successfulServerRequestData) {
          this.toastr.success("please log in to activate your account");
          this.router.navigate(["/login"]);
        }

      }, serverErrorResponse => {
        this.toastr.error(serverErrorResponse.error.error)
      });
    }
  }


  ngOnInit() {

    this.globalIdFormControl = new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
    this.emailFormControl = new FormControl("", [Validators.required,
    Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g), Validators.email]);
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
