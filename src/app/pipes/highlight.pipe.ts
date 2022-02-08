import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(name: string, searchProductInReceipt: string): string {
    if (!searchProductInReceipt) {
      return name;
    }
    const regexName = new RegExp(searchProductInReceipt, 'gi');
    return name.replace(regexName, '<mark>$&</mark>');
  }
}
