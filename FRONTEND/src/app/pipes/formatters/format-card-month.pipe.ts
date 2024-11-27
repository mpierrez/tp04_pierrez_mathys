import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCardMonth',
  standalone: true,
})

export class FormatCardMonthPipe implements PipeTransform {
  transform(cardMonth: any): string {
    return (!isNaN(cardMonth) && cardMonth != null && cardMonth.toString().length > 0
      ? cardMonth.toString().padStart(2, '0')
      : 'MM');
  }
}
