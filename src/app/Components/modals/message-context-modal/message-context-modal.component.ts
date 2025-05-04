import {Component, Input} from '@angular/core';
import {ModalBaseComponent} from '../modal-base/modal-base.component';
import {Message} from '../../../Data/Models/Message/message';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-message-context-modal',
  imports: [
    NgStyle
  ],
  templateUrl: './message-context-modal.component.html',
  styleUrl: './message-context-modal.component.css'
})
export class MessageContextModalComponent extends ModalBaseComponent{
  @Input() message!: Message;
  @Input() position?: { x: number, y: number };

  protected copyMessage() {
    if (this.message) {
      navigator.clipboard.writeText(this.message.text)
    }
  }

  protected openReactionsMenu() {
    console.log('context ', this.message.id);
  }
}
