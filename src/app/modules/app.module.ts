import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../components/header/header.component';
import { LayoutComponent } from '../components/layout/layout.component';
import { FooterComponent } from '../components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminModule } from './admin.module';
import { RoutingModule } from './routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from '../components/admin/admin.component';
import { CartComponent } from '../components/cart/cart.component';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { LoginComponent } from '../components/login/login.component';
import { OrderComponent } from '../components/order/order.component';
import { Page404Component } from '../components/page404/page404.component';
import { ProductContainerComponent } from '../components/product-container/product-container.component';
import { RegisterComponent } from '../components/register/register.component';
import { SingleProductComponent } from '../components/single-product/single-product.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { AuthenticationInterceptor } from '../interceptors/AuthenticationInterceptor';
import { CartService } from '../services/cart.service';
import { CategoriesService } from '../services/category.service';
import { CityService } from '../services/city.service';
import { ItemsService } from '../services/items.service';
import { OrderService } from '../services/order.service';
import { ProductsService } from '../services/products.service';
import { UploadService } from '../services/upload.service';
import { UsersService } from '../services/users.service';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    LoginComponent,
    FilterPipe,
    RegisterComponent,
    CartComponent,
    AdminComponent,
    Page404Component,
    ProductContainerComponent,
    SingleProductComponent,
    OrderComponent,
    FileUploadComponent,
    FooterComponent,
    HighlightPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdminModule,
    FontAwesomeModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [CartService, CategoriesService, CityService, ItemsService, OrderService, ProductsService, UploadService, UsersService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
