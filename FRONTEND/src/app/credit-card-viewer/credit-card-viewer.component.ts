import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { Observable } from 'rxjs';
import { CreditCard } from '../models/creditCard';
import { CommonModule } from '@angular/common';
import { FormatCardHolderNamePipe } from '../pipes/formatters/format-card-holder-name.pipe';
import { FormatCardMonthPipe } from '../pipes/formatters/format-card-month.pipe';
import { FormatCardYearPipe } from '../pipes/formatters/format-card-year.pipe';
import { MaskCreditCardPipe } from '../pipes/masks/mask-credit-card.pipe';
import { MaskCVVPipe } from '../pipes/masks/mask-cvv.pipe';

@Component({
  selector: 'app-credit-card-viewer',
  standalone: true,
  imports: [CommonModule, MaskCreditCardPipe, MaskCVVPipe , FormatCardHolderNamePipe, FormatCardMonthPipe, FormatCardYearPipe],
  templateUrl: './credit-card-viewer.component.html',
  styleUrls: ['./credit-card-viewer.component.css']
})
export class CreditCardViewerComponent implements OnInit {

  card$: Observable<CreditCard>;
  cardNumber: number;
  cardHolderName: string = "FULL NAME";
  cardMonth: number;
  cardYear: number;
  cardCvv: number;
  cardBackground: number = Math.floor(Math.random() * 25) + 1;
  isCardFlipped: boolean = false;

  constructor(private cardService : CardService) { }

  ngOnInit() {
    this.cardService.setCardInfo({
      cardNumber: this.cardNumber,
      cardHolderName: this.cardHolderName,
      cardMonth: this.cardMonth,
      cardYear: this.cardYear,
      cardCvv: this.cardCvv,
      isCardFlipped: this.isCardFlipped,
      isEditing: false
    });
    this.card$ = this.cardService.cards$;
  }
}
