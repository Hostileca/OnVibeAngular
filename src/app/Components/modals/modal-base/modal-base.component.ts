import {Directive} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Directive()
export abstract class ModalBaseComponent {
  protected constructor(private readonly _activeModal: NgbActiveModal) {}

  public close() {
    this._activeModal.close();
  }
}
