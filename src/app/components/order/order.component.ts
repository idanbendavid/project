import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { IOrder } from 'src/app/models/IOrder';
import { IUser } from 'src/app/models/IUser';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';
import { OrderService } from 'src/app/services/order.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(public cityService: CityService, public orderService: OrderService, private toastr: ToastrService, public cartService: CartService,
    private router: Router, public usersService: UsersService) {
  }

  public creditCardRegex = "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$";

  public searchProductInReceipt: string = "";

  public user: IUser = {
    userId: 0,
    globalId: 0,
    email: '',
    userType: '',
    firstName: '',
    lastName: '',
    city: '',
    street: ''
  }

  @ViewChild("citySelectRef", { static: false })
  citySelectRef!: ElementRef;

  @ViewChild("streetForOrderRef", { static: false })
  streetForOrderRef!: ElementRef;

  @ViewChild("shippingDateRef", { static: false })
  shippingDateRef!: ElementRef;

  @ViewChild("OrderIdRef", { static: false })
  OrderIdRef!: ElementRef;

  @ViewChild("creditCardRef", { static: false })
  creditCardRef!: ElementRef;

  @ViewChild("expirationDateRef", { static: false })
  expirationDateRef!: ElementRef;

  @ViewChild("cvvRef", { static: false })
  cvvRef!: ElementRef;

  public globalIdFormControl = new FormControl(0);
  public cityFormControl = new FormControl("");
  public streetFormControl = new FormControl("");
  public creditCardFormControl = new FormControl(0);
  public shippingDateFormControl = new FormControl("");


  public getDetailsOfUser() {
    let observable = this.usersService.getDataOfUser()
    observable.subscribe((response) => {
      this.user = response[0];
    }, error => { this.toastr.error(error.error.error) })
  }


  private calcOrderDate() {
    let orderDateDay = new Date().getDate();
    let orderDateMonth = new Date().getMonth() + 1;
    let orderDateYear = new Date().getFullYear()

    if (orderDateDay < 10 && orderDateMonth < 10) {
      return `${orderDateYear}-0${orderDateMonth}-0${orderDateDay}`;
    }
    else {
      return `${orderDateYear}-${orderDateMonth}-${orderDateDay}`;
    }

  }

  public clearFormInputData() {

    this.citySelectRef.nativeElement.options.selectedIndex = 0;
    this.streetForOrderRef.nativeElement.value = ""
    this.shippingDateRef.nativeElement.value = ""
    this.OrderIdRef.nativeElement.value = ""
    this.creditCardRef.nativeElement.value = ""
  }


  public printRecieptAsPdf() {

    let documentId = document.getElementById("contentToConvert");
    if (!documentId) {
      this.toastr.error("could not find document to print");
    }
    else {
      html2canvas(documentId).then(canvas => {
        const contentDataURL = canvas.toDataURL("image.png");
        let pdf = new jsPDF('portrait', 'mm', 'a4');
        var width = pdf.internal.pageSize.getWidth();
        var height = canvas.height * width / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
        pdf.save('order-reciept.pdf');
      });
    }
  }


  public order() {

    let newOrder: IOrder = {
      globalId: this.globalIdFormControl.value,
      cartId: this.cartService.cart.cartId,
      finalPrice: this.cartService.finalPrice.value,
      creditCard: this.creditCardFormControl.value,
      shippingCity: this.cityFormControl.value,
      shippingStreet: this.streetFormControl.value,
      shippingDate: this.shippingDateFormControl.value,
      orderDate: this.calcOrderDate()
    }

    let observable = this.orderService.order(newOrder)
    observable.subscribe((response) => {

      if (response) {
        this.toastr.success("Your Order Has Been Submitted");

        this.clearFormInputData();

        this.printRecieptAsPdf();


        setTimeout(() => {
          this.toastr.success("Thanks For Shopping At Retails R Us Hoping To See You Again Soon");
          localStorage.removeItem("token");
          this.router.navigate(["/login"]);
        }, 3000);


      }
    }, error => { this.toastr.error(error.error.error) })

  }


  ngOnInit(): void {

    this.globalIdFormControl = new FormControl(0, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)]));
    this.cityFormControl = new FormControl("", Validators.required);
    this.streetFormControl = new FormControl("", Validators.required);
    this.creditCardFormControl = new FormControl(0, Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16),
    Validators.pattern(this.creditCardRegex)]));
    this.shippingDateFormControl = new FormControl("", Validators.required);

    this.getDetailsOfUser();

  }

}
