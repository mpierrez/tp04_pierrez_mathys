import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CardService } from '../services/card.service';
import { SignalService } from '../services/signal.service';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../models/creditCard';
import { MaxLengthNumberDirective } from '../directives/max-length-number.directive';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaxLengthNumberDirective, OnlyNumbersDirective],
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
})
export class FormCardComponent {
  constructor(private fb: FormBuilder, private cardService: CardService, private signalService: SignalService) {}

  addCardForm: FormGroup;
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  isCardFlipped: boolean = false;
  alreadySubmitted: boolean = false;

  ngOnInit() {
    this.addCardForm = this.fb.group({
      cardNumberControl: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolderNameControl: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]],
      cardMonthControl: ['', [Validators.required]],
      cardYearControl: ['', [Validators.required]],
      cardCvvControl: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  get cardNumberControl(): FormControl {
    return this.addCardForm.get('cardNumberControl') as FormControl;
  }

  get cardHolderNameControl(): FormControl {
    return this.addCardForm.get('cardHolderNameControl') as FormControl;
  }

  get cardMonthControl(): FormControl {
    return this.addCardForm.get('cardMonthControl') as FormControl;
  }

  get cardYearControl(): FormControl {
    return this.addCardForm.get('cardYearControl') as FormControl;
  }

  get cardCvvControl(): FormControl {
    return this.addCardForm.get('cardCvvControl') as FormControl;
  }

  public validateTitleControl(titleControl: FormControl): string {
    if (titleControl.errors && (titleControl?.touched  || this.alreadySubmitted)) {
      if (titleControl.errors?.['required']) {
        return 'Le champ est obligatoire';
      }

      if (titleControl.errors?.['minlength']) {
        return `Le champ doit contenir au moins ${titleControl.errors['minlength'].requiredLength} caractères`;
      }
      if (titleControl.errors?.['maxlength']) {
        return `Le champ doit contenir au plus ${titleControl.errors['maxlength'].requiredLength} caractères`;
      }

      if (titleControl.errors?.['pattern']) {
        return 'Le champ ne respecte pas le format attendu';
      }

      return 'Erreur inconnue';
    }
    return '';
  }

  onSubmit() {
    console.log(this.addCardForm.value);
    this.alreadySubmitted = true;
    if (!this.addCardForm.valid) {
      alert('Form invalid ! :(');
      return;
    }

    const newCard: CreditCard = {
      cardType: '',
      cardNumber: this.addCardForm.value.cardNumberControl,
      cardHolderName: this.addCardForm.value.cardHolderNameControl,
      cardMonth: parseInt(this.addCardForm.value.cardMonthControl),
      cardYear: parseInt(this.addCardForm.value.cardYearControl),
      cardCvv: this.addCardForm.value.cardCvvControl,
      isCardFlipped: false,
      isEditing: false,
    };

    this.signalService.addCard(newCard);
    this.addCardForm.reset();
    this.alreadySubmitted = false;
    this.updateCard();
  }

  flipCard() {
    this.isCardFlipped = !this.isCardFlipped;
    this.updateCard();
  }

  updateCard() {
    this.cardService.setCardInfo({
      cardNumber: this.addCardForm.value.cardNumberControl,
      cardHolderName: this.addCardForm.value.cardHolderNameControl,
      cardMonth: parseInt(this.addCardForm.value.cardMonthControl),
      cardYear: parseInt(this.addCardForm.value.cardYearControl),
      cardCvv: this.addCardForm.value.cardCvvControl,
      isCardFlipped: this.isCardFlipped,
    });
  }
}
