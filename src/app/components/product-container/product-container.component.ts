import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/models/IProducts';
import { CategoriesService } from 'src/app/services/category.service';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css']
})
export class ProductContainerComponent implements OnInit {

  public products: IProducts[] = [];
  private categoryIdSubscription: Subscription;

  public searchProduct: string = '';

  constructor(public productsService: ProductsService, private categoriesService: CategoriesService, private toastr: ToastrService, public usersService: UsersService) {
    this.productsService = productsService;

    this.categoryIdSubscription = this.categoriesService.categoryIdChange().subscribe(
      newCategoryId => {
        if (newCategoryId === 0) {
          this.getAllProducts();
        }
        else {
          const observable = this.productsService.getProductsByCategoryId(newCategoryId);
          observable.subscribe(successfulServerResponse => {
            this.products = successfulServerResponse;
          }, serverErrorResponse => {
            this.toastr.error(serverErrorResponse.error.error)
          });
        }
      }
    )
  }

  public getAllProducts() {
    const observable = this.productsService.getAllProducts()
    observable.subscribe((products) => {
      this.products = products;
      this.products.sort((a: IProducts, b: IProducts) => a.name.localeCompare(b.name))
    }, error => { this.toastr.error(error.error) })
  }


  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.categoryIdSubscription.unsubscribe();
  }


}
