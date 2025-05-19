import {Component, Input} from '@angular/core';
import {ContextMenuBaseComponent} from '../context-menu-base/context-menu-base.component';
import {NgIf} from '@angular/common';
import {SendMessage} from '../../../Data/Models/Message/send-message';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerModalComponent} from '../../modals/date-picker-modal/date-picker-modal.component';
import {MessageService} from '../../../Data/Services/message.service';

@Component({
  selector: 'app-send-message-context-menu',
  imports: [
    NgIf
  ],
  templateUrl: './send-message-context-menu.component.html',
  styleUrl: './send-message-context-menu.component.css'
})
export class SendMessageContextMenuComponent extends ContextMenuBaseComponent {
  @Input({ required: true }) sendMessage!: SendMessage;

  constructor(private readonly _modalService: NgbModal,
              private readonly _messageService: MessageService) {
    super();
  }

  async sendScheduleMessage() {
    const modalRef = this._modalService.open(DatePickerModalComponent, {
      size: 'lg',
      centered: true
    });

    try {
      const selectedDate: Date = await modalRef.result;

      if (selectedDate) {
        this.sendMessage.date = selectedDate;
        console.log(this.sendMessage);
        await this._messageService.sendMessage(this.sendMessage);
      }
    } catch (e) {
    }
  }
}
