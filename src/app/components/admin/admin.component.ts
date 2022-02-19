import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/models/ICategory';
import { IProducts } from 'src/app/models/IProducts';
import { CategoriesService } from 'src/app/services/category.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild("productNameRef", { static: false })
  productNameRef!: ElementRef;

  @ViewChild("categoryNameRef", { static: false })
  categoryNameRef!: ElementRef;

  @ViewChild("productPriceRef", { static: false })
  productPriceRef!: ElementRef;

  @ViewChild("productStockRef", { static: false })
  productStockRef!: ElementRef;

  // above view child for add form
  // below view child for edit form

  @ViewChild("editProductIdRef", { static: false })
  editProductIdRef!: ElementRef;

  @ViewChild("editProductNameRef", { static: false })
  editProductNameRef!: ElementRef;

  @ViewChild("editCategoryNameRef", { static: false })
  editCategoryNameRef!: ElementRef;

  @ViewChild("editProductPriceRef", { static: false })
  editProductPriceRef!: ElementRef;

  @ViewChild("editProductImageRef", { static: false })
  editProductImageRef!: ElementRef;

  @ViewChild("editProductStockRef", { static: false })
  editProductStockRef!: ElementRef;

  // below add category view child

  @ViewChild("addCategoryRef", { static: false })
  addCategoryRef!: ElementRef;

  public productsSubscription: Subscription;
  public addCategorySubscription: Subscription;
  public products: IProducts[] = [];
  public categories: ICategory[] = [];

  constructor(public productsService: ProductsService, public categoriesService: CategoriesService, private toastr: ToastrService) {
    this.productsSubscription = this.productsService.getAdminProductTable().subscribe(newProduct => { });

    this.addCategorySubscription = this.categoriesService.getAdminCategoriesTable().subscribe(newCategory => {
      console.log(newCategory);

      newCategory.categoryId = this.categories.length;
      newCategory.categoryName = this.addCategoryRef.nativeElement.value

    })
  }


  p: number = 1;
  // count: number = 25;


  public addProductFormGroup = new FormGroup({});
  public addProductNameFormControl = new FormControl("");
  public addProductCategoryFormControl = new FormControl();
  public addProductPriceFormControl = new FormControl();
  public addProductImageFormControl = new FormControl("");
  public addProductStockFormControl = new FormControl("");


  public editProductFormGroup = new FormGroup({});
  public editProductIdFormControl = new FormControl();
  public editProductNameFormControl = new FormControl("");
  public editProductCategoryFormControl = new FormControl();
  public editProductPriceFormControl = new FormControl();
  public editProductImageFormControl = new FormControl("");
  public editProductStockFormControl = new FormControl("");

  public addCategoryFromGroup = new FormGroup({});
  public addCategoryNameFormControl = new FormControl("");

  public showProductList: boolean = false;
  public showCategoryList: boolean = false;


  public showProducts() {
    this.showProductList = true;

    if (this.showProductList === true) {
      this.showCategoryList = false;
    }

  }

  public showCategories() {
    this.showCategoryList = true;
    if (this.showCategoryList === true) {
      this.showProductList = false;
    }

  }


  public addProduct() {
    for (let index = 0; index < this.categories.length; index++) {
      if (this.addProductCategoryFormControl.value === this.categories[index].categoryName) {
        this.addProductCategoryFormControl.setValue(this.categories[index].categoryId,
          { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
      }
    }

    let newProduct: IProducts = this.addProductFormGroup.value;

    let observable = this.productsService.addProducts(newProduct)
    observable.subscribe(() => {

      for (let index = 0; index < this.products.length; index++) {
        newProduct.productId = (this.products.length + 1);
      }

      for (let index = 0; index < this.categories.length; index++) {
        if (newProduct.categoryId === this.categories[index].categoryId) {
          newProduct.categoryName = this.categories[index].categoryName;
        }
      }

      this.products.push(newProduct);
      this.productsService.setAdminProductTable(this.products);
    }, error => { this.toastr.error(error.error) })


    this.productNameRef.nativeElement.value = ""
    this.categoryNameRef.nativeElement.options.selectedIndex = 0;
    this.productPriceRef.nativeElement.value = ""
    this.productStockRef.nativeElement.value = ""

  }

  public editProduct() {
    for (let index = 0; index < this.categories.length; index++) {
      if (this.editProductCategoryFormControl.value === this.categories[index].categoryName) {
        this.editProductCategoryFormControl.setValue(this.categories[index].categoryId,
          { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
      }
    }

    let editedProduct: IProducts = this.editProductFormGroup.value;

    let observable = this.productsService.editProducts(editedProduct)
    observable.subscribe(() => {

      for (let index = 0; index < this.categories.length; index++) {
        if (editedProduct.categoryId === this.categories[index].categoryId) {
          editedProduct.categoryName = this.categories[index].categoryName;
        }
      }

      for (let index = 0; index < this.products.length - 1; index++) {
        if (editedProduct.productId === this.products[index].productId) {
          this.products[index] = editedProduct;
        }
      }

    }, error => { this.toastr.error(error.error) })

    this.editProductIdRef.nativeElement.value = ""
    this.editProductNameRef.nativeElement.value = ""
    this.editCategoryNameRef.nativeElement.options.selectedIndex = 0;
    this.editProductPriceRef.nativeElement.value = ""
    this.editProductImageRef.nativeElement.value = ""
    this.editProductStockRef.nativeElement.value = ""

  }

  public addCategory() {
    let observable = this.categoriesService.addCategories(this.addCategoryFromGroup.value)
    observable.subscribe((newCategory) => {

      newCategory.categoryName = this.addCategoryNameFormControl.value;
      newCategory.categoryId = this.categories.length+1;

      this.categories.push(newCategory);

      this.categoriesService.setAdminCategoriesTable(this.categories);

    }, error => { this.toastr.error(error.error) })

    this.addCategoryRef.nativeElement.value = ""

  }


  public getAllProducts() {
    let observable = this.productsService.getAllProducts()
    observable.subscribe((products) => {
      this.products = products;
    }, error => { this.toastr.error(error.error) })

  }

  public getAllCategories() {
    let observable = this.categoriesService.getAllCategories()
    observable.subscribe((categories) => {
      this.categories = categories;

    }, error => { this.toastr.error(error.error) })
  }

  public onEditFileUpload(event: any) {
    this.editProductImageFormControl.setValue(event,
      { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
  }

  public onFileUpload(event: any) {
    this.addProductImageFormControl.setValue(event,
      { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
  }

  public onEditClick(product: IProducts) {

    this.editProductIdFormControl.setValue(product.productId, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
    this.editProductNameFormControl.setValue(product.name, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
    this.editProductCategoryFormControl.setValue(product.categoryName, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
    this.editProductPriceFormControl.setValue(product.pricePerUnit, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
    this.editProductImageFormControl.setValue(product.image, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
    this.editProductStockFormControl.setValue(product.stock, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });

    this.editProductFormGroup = new FormGroup({
      productId: this.editProductIdFormControl,
      name: this.editProductNameFormControl,
      categoryId: this.editProductCategoryFormControl,
      pricePerUnit: this.editProductPriceFormControl,
      image: this.editProductImageFormControl,
      stock: this.editProductStockFormControl
    })

  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();

    this.addProductFormGroup = new FormGroup({
      name: this.addProductNameFormControl,
      categoryId: this.addProductCategoryFormControl,
      pricePerUnit: this.addProductPriceFormControl,
      image: this.addProductImageFormControl,
      stock: this.addProductStockFormControl
    })

    this.editProductFormGroup = new FormGroup({
      productId: this.editProductIdFormControl,
      name: this.editProductNameFormControl,
      categoryId: this.editProductCategoryFormControl,
      pricePerUnit: this.editProductPriceFormControl,
      image: this.editProductImageFormControl,
      stock: this.editProductStockFormControl
    })

    this.addCategoryFromGroup = new FormGroup({
      categoryName: this.addCategoryNameFormControl
    })
  }

}
