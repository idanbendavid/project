import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTrashAlt, faDumpster } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/models/IProducts';
import { CartService } from 'src/app/services/cart.service';
import { ItemsService } from 'src/app/services/items.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  public faTrashAlt = faTrashAlt;
  public faDupmster = faDumpster;
  public quantityMinValue: number = 1;
  public totalPrice: any | number = 0;
  public deleteItemSubscription: Subscription;
  public deleteAllCartItemsSubscription: Subscription;
  public isCompleteOrderClicked: boolean = false;


  constructor(public cartService: CartService, public usersService: UsersService, private modalService: NgbModal,
    public toastr: ToastrService, private router: Router, public itemsService: ItemsService) {

    this.deleteItemSubscription = this.itemsService.getDeleteOneItemSubject().subscribe(productId => {
      for (let i = 0; i < this.cartService.cart.lineItems.length; i++) {
        if (productId === this.cartService.cart.lineItems[i].productId) {
          this.cartService.cart.lineItems.splice(i, 1)
        }
      }
    })

    this.deleteAllCartItemsSubscription = this.itemsService.getDeleteCartItems().subscribe(cartId => {
      for (let index = 0; index < this.cartService.cart.lineItems.length; index++) {
        if (cartId === this.cartService.cart.cartId) {
          this.cartService.cart.lineItems.splice(index, this.cartService.cart.lineItems.length);
        }
      }
    })

  }


  public getCartOfUser() {
    if (this.usersService.userType === "admin") {
      this.toastr.warning("Admin ,In Order To Buy Log In To Your Customer Account")
    }
    else {
      let observable = this.cartService.getCartOfUser();

      observable.subscribe((serverSuccessfulResponse) => {

        if (serverSuccessfulResponse) {

          this.cartService.cart = serverSuccessfulResponse;

          for (let index = 0; index < this.cartService.cart.lineItems.length; index++) {

            this.totalPrice += this.cartService.cart.lineItems[index].finalPrice;
            this.cartService.updateFinalPrice(this.totalPrice);
          }
        }
        else {
          this.addCartToUser();
        }

      }, error => { this.toastr.error(error.error) })
    }
  }

  public addCartToUser() {
    let newCart = {};

    let observable = this.cartService.addCartToUser(newCart);
    observable.subscribe((response) => {

    }, error => { this.toastr.error(error.error) })
  }

  // delete one item from cart
  public onClickDeleteOneItemFromCart(productId: any | number) {

    let observable = this.itemsService.deleteItemFromCartByCartIdAndProductId(this.cartService.cart.cartId, productId);
    observable.subscribe((response) => {
      this.itemsService.setDeleteOneItemSubject(productId);
    }, error => { this.toastr.error(error.error) })

    for (let index = 0; index < this.cartService.cart.lineItems.length; index++) {
      if (this.cartService.cart.lineItems[index].productId === productId) {
        this.totalPrice = (this.cartService.finalPrice.value - this.cartService.cart.lineItems[index].finalPrice);
        this.cartService.updateFinalPrice(this.totalPrice);
      }
    }
  }

  // delete all items from cart
  public onClickDeleteAllItemsFromCart(cartId: number) {

    let observable = this.itemsService.deleteAllItemsFromCart(cartId);
    observable.subscribe((response) => {
      if (response) {
        this.itemsService.setDeleteCartItems(cartId);
        this.cartService.updateFinalPrice(0);
      }
    }, error => { this.toastr.error(error.error) })

  }

  onSelcetQuantityClicked(content: any) {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  // server quantity cahnge put request in items
  public onItemQuantityChange(event: any, productId: number, pricePerUnit: number) {

    let quantity = +event.target.value;

    let updatedItem = {
      quantity: quantity,
      finalPrice: (quantity * pricePerUnit),
      cartId: this.cartService.cart.cartId,
      productId: productId
    }

    let observable = this.itemsService.updateItemQuantity(updatedItem);
    observable.subscribe((response) => {
      if (response) {
        for (let index = 0; index < this.cartService.cart.lineItems.length; index++) {
          if (this.cartService.cart.lineItems[index].productId === updatedItem.productId) {
            this.cartService.cart.lineItems[index].quantity = updatedItem.quantity;
            this.cartService.cart.lineItems[index].finalPrice = updatedItem.finalPrice;
          }
        }
      }
    }, error => { this.toastr.error(error.error) })
  }


  public onCompletePurchaseClicked() {
    this.isCompleteOrderClicked = true;

    this.totalPrice = 0;
    this.cartService.updateFinalPrice(0);

    for (let index = 0; index < this.cartService.cart.lineItems.length; index++) {
      this.totalPrice += this.cartService.cart.lineItems[index].finalPrice;
      this.cartService.updateFinalPrice(this.totalPrice);

    }

    setTimeout(() => {
      this.modalService.dismissAll();
      this.router.navigate(["/myorder"]);
    }, 2500);
  }


  ngOnInit(): void {
    this.getCartOfUser();

    this.cartService.currentFinalPrice.subscribe(this.totalPrice);

  }

  ngOnDestroy(): void {
    this.deleteItemSubscription.unsubscribe();
    this.deleteAllCartItemsSubscription.unsubscribe();
  }

}
