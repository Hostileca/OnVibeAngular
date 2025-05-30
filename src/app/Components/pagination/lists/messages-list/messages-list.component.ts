import {Component, Input} from '@angular/core';
import {PaginationBaseComponent} from '../pagination-base/pagination-base.component';
import {Message} from '../../../../Data/Models/Message/message';
import {AsyncPipe, NgForOf} from '@angular/common';
import {MessageComponent} from '../../items/message/message.component';
import {EventBusService} from '../../../../Data/Services/event-bus.service';
import {Events} from '../../../../Data/Hubs/events';
import {Chat} from '../../../../Data/Models/Chat/chat';

@Component({
  selector: 'app-messages-list',
  imports: [
    NgForOf,
    MessageComponent,
    AsyncPipe
  ],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent extends PaginationBaseComponent<Message> {
  @Input() chat!: Chat;

  constructor(private readonly _eventBusService: EventBusService) {
    super();
    this.startListening()
  }

  override ngAfterViewInit(){
    this.scrollToBottom();
    super.ngAfterViewInit();
  }

  private startListening(){
    this._eventBusService.On<Message>(Events.MessageSent).subscribe(message => {
      if (this.chat && message.chatId == this.chat.id){
        this._entities$.next([message, ...this._entities$.value]);
      }
    })
  }

  private scrollToBottom(): void {
    this.listContainer.nativeElement.scrollTop = this.listContainer.nativeElement.scrollHeight;
  }
}
