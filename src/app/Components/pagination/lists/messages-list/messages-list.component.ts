import {AfterViewChecked, Component, ElementRef, Input, ViewChild} from '@angular/core';
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
export class MessagesListComponent extends PaginationBaseComponent<Message> implements AfterViewChecked {
  @Input() chat!: Chat;

  constructor(private readonly _eventBusService: EventBusService) {
    super();
    this.startListening()
  }

  ngAfterViewChecked(): void {
     this.scrollToBottom()
  }

  private startListening(){
    this._eventBusService.On<Message>(Events.MessageSent).subscribe(message => {
      if (this.chat && message.chatId == this.chat.id){
        this._entities$.value.push(message)
      }
    })
  }

  private scrollToBottom(): void {
    console.log(this._entities$.value);
    console.log('scrollToBottom');
    try {
      this.listContainer.nativeElement.scrollTop = this.listContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error(err);
    }
  }
}
