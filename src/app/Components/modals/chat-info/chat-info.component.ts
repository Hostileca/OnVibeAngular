import {Component, Input} from '@angular/core';
import {Chat} from '../../../Data/Models/Chat/chat';
import {ModalBaseComponent} from '../modal-base/modal-base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat-info',
  imports: [],
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.css'
})
export class ChatInfoComponent extends ModalBaseComponent {
  @Input({required: true}) chat!: Chat;

  constructor(activeModal: NgbActiveModal) {
    super(activeModal);
  }
}
