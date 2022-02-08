import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from '../components/admin/admin.component';
import { LoginComponent } from '../components/login/login.component';
import { OrderComponent } from '../components/order/order.component';
import { Page404Component } from '../components/page404/page404.component';
import { ProductContainerComponent } from '../components/product-container/product-container.component';
import { RegisterComponent } from '../components/register/register.component';
import { AdminGuard } from '../guard/admin.guard';

const routes: Routes = [
  { path: "products", component: ProductContainerComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "myorder", component: OrderComponent },
  { path: "admin", canActivate: [AdminGuard], component: AdminComponent },
  { path: "", redirectTo: "products", pathMatch: "full" },
  { path: "**", component: Page404Component }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class RoutingModule {

}