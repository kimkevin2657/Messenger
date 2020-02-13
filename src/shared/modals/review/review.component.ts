import { Component, Injector, OnInit } from '@angular/core';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent extends Extender implements OnInit {
  public model: { rating: number; comment: string; uid: string } = { rating: 0, comment: '', uid: '' };

  constructor(protected injector: Injector, private authService: AuthService, private firestoreService: FirestoreService) {
    super(injector);
  }

  /** get user id and assign to model */
  public async ngOnInit() {
    const { uid } = await this.authService.getUser();
    this.model.uid = uid;
  }

  /** update rating value */
  public update(val: number) {
    this.model.rating = val;
  }

  /** save feedback */
  public save() {
    this.firestoreService.add(`feedback`, this.model).then(() => {
      this.toast(this.translate.instant('feedback-component.success-message'));
      this.closeModal();
    });
  }
}
