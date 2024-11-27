import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditCard } from '../models/creditCard';

@Injectable({
  providedIn: 'root'
})

export class CardService {

  private cardsSubject: BehaviorSubject<CreditCard> = new BehaviorSubject<CreditCard>(new CreditCard());
  public cards$: Observable<CreditCard> = this.cardsSubject.asObservable();

  constructor() { }

  public setCardInfo(data: any): void {
    const card: CreditCard = {
      cardType: this.getCardType(data.cardNumber),
      cardNumber: data.cardNumber,
      cardHolderName: data.cardHolderName,
      cardMonth: data.cardMonth,
      cardYear: data.cardYear,
      cardCvv: data.cardCvv,
      isCardFlipped: data.isCardFlipped,
      isEditing: data.isEditing
    };
    this.cardsSubject.next(card);
  }

  private getCardType(cardNumber: number): string {
    if(cardNumber == 0 || cardNumber == null) return 'visa';
    if (/^4/.test(cardNumber.toString())) return 'visa';
    if (/^(34|37)/.test(cardNumber.toString())) return 'amex';
    if (/^5[1-5]/.test(cardNumber.toString())) return 'mastercard';
    if (/^6011/.test(cardNumber.toString())) return 'discover';
    if (/^9792/.test(cardNumber.toString())) return 'troy';
    return 'visa';
  }

}
