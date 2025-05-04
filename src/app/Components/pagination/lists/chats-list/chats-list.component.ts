import {Component, EventEmitter, Output} from '@angular/core';
import { PaginationBaseComponent } from '../pagination-base/pagination-base.component';
import {Chat} from '../../../../Data/Models/Chat/chat';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChatComponent} from '../../items/chat/chat.component';
import {Message} from '../../../../Data/Models/Message/message';
import {Events} from '../../../../Data/Hubs/events';
import {EventBusService} from '../../../../Data/Services/event-bus.service';

@Component({
  selector: 'app-chats-list',
  imports: [
    NgForOf,
    ChatComponent,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css'
})
export class ChatsListComponent extends PaginationBaseComponent<Chat> {
  @Output() onSelectChat = new EventEmitter<Chat>();

  constructor(private readonly _eventBusService: EventBusService) {
    super();
    this._loadingContainerId = 'chats-container';
    this.startListening();
  }

  public selectChat(chat: Chat) {
    this.onSelectChat.emit(chat);
  }

  private startListening() {
    this._eventBusService.On<Chat>(Events.ChatAdded).subscribe(chat => {
      const current = this._entities$.value;
      this._entities$.next([chat, ...current]);
      this.sort();
    });

    this._eventBusService.On<Message>(Events.MessageSent).subscribe(_ => {
      this.sort();
    });
  }

  private sort() {
    const sorted = [...this._entities$.value].sort((a, b) => {
      const dateA = new Date(a.preview.date);
      const dateB = new Date(b.preview.date);

      return dateA.getTime() - dateB.getTime();
    });

    this._entities$.next(sorted);
  }
}
