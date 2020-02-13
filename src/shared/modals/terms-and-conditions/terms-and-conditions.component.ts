import { Component, Injector, OnInit } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent extends Extender implements OnInit {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit() {}
}
