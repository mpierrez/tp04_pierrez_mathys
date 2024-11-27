import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCardYear',
  standalone: true,
})

export class FormatCardYearPipe implements PipeTransform {
  transform(cardYear: any): string {
    return !isNaN(cardYear) && cardYear != null && cardYear.toString().length === 4
      ? cardYear.toString().slice(-2)
      : 'YY';
  }
}
