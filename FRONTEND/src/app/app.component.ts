import { Component } from '@angular/core';
import { FormCardComponent } from "./form-card/form-card.component";
import { CreditCardViewerComponent } from "./credit-card-viewer/credit-card-viewer.component";
import { ListCardsComponent } from './list-cards/list-cards.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormCardComponent, CreditCardViewerComponent, ListCardsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tp04_pierrez_mathys';
}
