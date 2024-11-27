import { Component, OnInit, Signal } from '@angular/core';
import { SignalService } from '../services/signal.service';
import { CreditCard } from '../models/creditCard';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaxLengthNumberDirective } from '../directives/max-length-number.directive';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';
import { MaskCreditCardPipe } from '../pipes/masks/mask-credit-card.pipe';
import { FormatCardMonthPipe } from '../pipes/formatters/format-card-month.pipe';
import { FormatCardYearPipe } from '../pipes/formatters/format-card-year.pipe';

@Component({
  selector: 'app-list-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaxLengthNumberDirective, OnlyNumbersDirective, MaskCreditCardPipe, FormatCardMonthPipe, FormatCardYearPipe],
  templateUrl: './list-cards.component.html',
  styleUrls: ['./list-cards.component.css']
})
export class ListCardsComponent implements OnInit {
  valServ: Signal<CreditCard[]>;
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  constructor(private fb: FormBuilder, private signalService: SignalService) {}

  ngOnInit() {
    this.valServ = this.signalService.val;
    this.editCardForm = this.fb.group({
      cardNumberControl: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolderNameControl: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]],
      cardMonthControl: ['', [Validators.required]],
      cardYearControl: ['', [Validators.required]],
      cardCvvControl: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  get cards(): CreditCard[] {
    return this.valServ();
  }

  editCardForm: FormGroup;
  alreadySubmitted: boolean = false;

  get cardNumberControl(): FormControl {
    return this.editCardForm.get('cardNumberControl') as FormControl;
  }

  get cardHolderNameControl(): FormControl {
    return this.editCardForm.get('cardHolderNameControl') as FormControl;
  }

  get cardMonthControl(): FormControl {
    return this.editCardForm.get('cardMonthControl') as FormControl;
  }

  get cardYearControl(): FormControl {
    return this.editCardForm.get('cardYearControl') as FormControl;
  }

  get cardCvvControl(): FormControl {
    return this.editCardForm.get('cardCvvControl') as FormControl;
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

  saveCard(card: CreditCard) {
    this.alreadySubmitted = true;
    if (!this.editCardForm.valid) {
      alert("Il y a une ou plusieurs erreurs dans le formulaire, veuillez les corriger avant de sauvegarder à nouveau");
      return;
    }

    const newCard: CreditCard = {
      cardType: '',
      cardNumber: this.editCardForm.value.cardNumberControl,
      cardHolderName: this.editCardForm.value.cardHolderNameControl,
      cardMonth: parseInt(this.editCardForm.value.cardMonthControl),
      cardYear: parseInt(this.editCardForm.value.cardYearControl),
      cardCvv: this.editCardForm.value.cardCvvControl,
      isCardFlipped: false,
      isEditing: false,
    };

    this.signalService.editCard(card, newCard);
    this.alreadySubmitted = false;
    this.editCardForm.reset();
  }

  editCard(card: CreditCard) {
    let alreadyEditing = false;
    this.valServ().forEach((c: CreditCard) => {
      if(c.isEditing) {
        alert("Vous ne pouvez éditer qu'une seule carte à la fois");
        alreadyEditing = true;
        return;
      }
    });

    if(alreadyEditing) return;

    card.isEditing = true;
    this.editCardForm.patchValue({
      cardNumberControl: card.cardNumber,
      cardHolderNameControl: card.cardHolderName,
      cardMonthControl: card.cardMonth,
      cardYearControl: card.cardYear,
      cardCvvControl: card.cardCvv,
    });
  }

  cancelEdit(card: CreditCard) {
    card.isEditing = false;
  }

  deleteCard(card: CreditCard) {
    this.signalService.deleteCard(card);
  }
}
