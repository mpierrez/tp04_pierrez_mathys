import { Injectable, signal } from '@angular/core';
import { CreditCard } from '../models/creditCard';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  private valSignal = signal<CreditCard[]>([]);
  constructor() {
    const initialCard: CreditCard = {
      cardNumber: 1234567890123456,
      cardHolderName: 'Mathys PIERREZ',
      cardMonth: 12,
      cardYear: 2025,
      cardCvv: 123,
      cardType: 'visa',
      isCardFlipped: false,
      isEditing: false,
    };
    this.addCard(initialCard);
  }

  get val() {
    return this.valSignal;
  }

  addCard(newCard: CreditCard) {
    this.valSignal.update((cards) => [...cards, newCard]);
  }

  editCard(card: CreditCard, newCard: CreditCard) {
    this.valSignal.update((cards) => cards.map((c) => (c === card ? newCard : c)));
  }

  deleteCard(card: CreditCard) {
    this.valSignal.update((cards) => cards.filter((c) => c !== card));
  }
}
