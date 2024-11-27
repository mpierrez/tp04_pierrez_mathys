import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCardHolderName',
  standalone: true,
})

export class FormatCardHolderNamePipe implements PipeTransform {
  transform(cardHolderName: any): string {
    return (cardHolderName == null || cardHolderName == '' || cardHolderName == undefined) ? 'FULL NAME' : cardHolderName.toUpperCase();
  }
}
