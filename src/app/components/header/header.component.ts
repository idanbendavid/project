import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/category.service';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { ICategory } from 'src/app/models/ICategory';
import { IProducts } from 'src/app/models/IProducts';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cart.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public categoriesService: CategoriesService,
    public usersService: UsersService, private toastr: ToastrService, public productsService: ProductsService,
    public cartService: CartService, public itemsService: ItemsService) { }

  public products: IProducts[] = [];
  public categories: ICategory[] = [];
  public faShoppingCart = faShoppingCart;
  public showCart: boolean = false;


  public logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
    this.usersService.firstName = "";
  }

  public moveToLoginPage() {
    this.router.navigate(["/login"]);
  }

  public moveToSpecificCategory(categoryId: number) {
    if (categoryId === 0) {
      this.router.navigate(["/ourProducts"]);
    }
    this.categoriesService.setCategoryId(categoryId)
  }

  public getAllCategories() {
    let observable = this.categoriesService.getAllCategories()
    observable.subscribe((categories) => {
      this.categories = categories;

    }, error => { this.toastr.error(error.error) })
  }

  public onShoppingCartIconClick(){
    this.router.navigate(["/cart"]);
    this.showCart = true;
    this.cartService.setCartViewState(this.showCart);
  }

  ngOnInit(): void {
    this.getAllCategories();

  }

}
