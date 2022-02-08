import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/models/IProducts';
import { CartService } from 'src/app/services/cart.service';
import { ItemsService } from 'src/app/services/items.service';
import { ProductsService } from 'src/app/services/products.service';
import { UploadService } from 'src/app/services/upload.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit, OnDestroy {

  public showButton: boolean = false;

  @Input() product: IProducts = {
    productId: 0,
    name: '',
    categoryId: 0,
    categoryName: '',
    pricePerUnit: 0,
    image: '',
    stock: 0,
    quantity: 0,
    finalPrice: 0,
    cartId: 0
  };

  private addItemSubscription: Subscription;

  constructor(public productsService: ProductsService, public cartService: CartService, public usersService: UsersService,
    private toastr: ToastrService, public itemsService: ItemsService, private uploadService: UploadService) {

    this.addItemSubscription = this.itemsService.getAddOneItemSubject().subscribe(addedItem => {
      this.itemsService.setAddItemSubject(addedItem);
    })

  }

  public totalPrice: any | number = 0


  public onClickAddToCart(product: IProducts) {

    let addedItem = {
      cartId: this.cartService.cart.cartId,
      productId: product.productId,
      quantity: 1,
      finalPrice: 1 * product.pricePerUnit
    }

    for (let index = 0; index < this.cartService.cart.lineItems.length; index++) {
      if (this.cartService.cart.lineItems[index].productId === addedItem.productId) {
        this.toastr.info("item already include in cart");
        return
      }
    }

    let observable = this.itemsService.addItemToCart(addedItem);
    observable.subscribe((response) => {
      if (response) {
        
        if (addedItem.productId === product.productId) {
          product.quantity = addedItem.quantity;
          product.finalPrice = addedItem.finalPrice;

          this.cartService.cart.lineItems.push(product);
        }

        for(let index=0; index < this.cartService.cart.lineItems.length; index++){
          this.cartService.updateFinalPrice(0);
          this.totalPrice += this.cartService.cart.lineItems[index].finalPrice;
          this.cartService.updateFinalPrice(this.totalPrice);
        }

      }
    }, error => { this.toastr.error(error.error.error)})

  }

  ngOnInit(): void {
    if(this.usersService.userType === "admin"){
      this.showButton = false;
    }
    else{
      this.showButton = true;
    }
  }

  ngOnDestroy(): void {
    this.addItemSubscription.unsubscribe();
  }

}
