import { Pipe, PipeTransform } from '@angular/core';
import { IProducts } from '../models/IProducts';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(products: IProducts[], searchProduct: string): any {
    if (!searchProduct) {
      return products;
    }
    let filterProducts: IProducts[] = products.filter(products => products.name?.toLowerCase().includes(searchProduct));

    return filterProducts;

  }

}
