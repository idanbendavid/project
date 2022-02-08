import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CategoriesService } from 'src/app/services/category.service';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { ICategory } from 'src/app/models/ICategory';
import { IProducts } from 'src/app/models/IProducts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public categoriesService: CategoriesService, public usersService: UsersService, private toastr: ToastrService, public productsService: ProductsService) { }

  public products: IProducts[] = [];
  public categories: ICategory[] = [];


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
      this.router.navigate(["/products"]);
    }
    this.categoriesService.setCategoryId(categoryId)
  }

  public getAllCategories() {
    let observable = this.categoriesService.getAllCategories()
    observable.subscribe((categories) => {
      this.categories = categories;

    }, error => { this.toastr.error(error.error) })
  }


  ngOnInit(): void {
    this.getAllCategories();

  }

}
