import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({template: ``})
export abstract class ModalBaseComponent {
  protected constructor(private readonly _activeModal: NgbActiveModal) {}

  public close() {
    this._activeModal.close();
  }
}
