import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import { PaginationBaseComponent } from '../pagination-base/pagination-base.component';
import {Chat} from '../../../../Data/Models/Chat/chat';
import {NgForOf, NgIf} from '@angular/common';
import {ChatComponent} from '../../items/chat/chat.component';
import {Message} from '../../../../Data/Models/Message/message';
import {Events} from '../../../../Data/Hubs/events';
import {EventBusService} from '../../../../Data/Services/event-bus.service';

@Component({
  selector: 'app-chats-list',
  imports: [
    NgForOf,
    ChatComponent,
    NgIf
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css'
})
export class ChatsListComponent extends PaginationBaseComponent<Chat>{
  @Output() onSelectChat = new EventEmitter<Chat>();

  constructor(private readonly _eventBusService: EventBusService) {
    super();
    this._loadingContainerId = 'chats-container'
    this.startListening()
  }

  public selectChat(chat: Chat) {
    this.onSelectChat.emit(chat)
  }

  protected override onLoadEntities(entities: Chat[]){
    super.onLoadEntities(entities);
    this.sort();
  }

  private startListening(){
    this._eventBusService.On<Chat>(Events.ChatAdded).subscribe(chat => {
      this.entities.push(chat)
      this.sort();
    })
    this._eventBusService.On<Message>(Events.MessageSent).subscribe(_ => {
      this.sort();
    })
  }

  private sort() {
    const sorted = [...this.entities].sort((a, b) =>
      new Date(b.preview.date).getTime() - new Date(a.preview.date).getTime()
    );

    this.entities = sorted;
  }
}
