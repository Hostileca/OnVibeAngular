import {Component, EventEmitter, Output} from '@angular/core';
import { PaginationBaseComponent } from '../pagination-base-component/pagination-base.component';
import {Chat} from '../../Data/Models/Chat/chat';
import {NgForOf, NgIf} from '@angular/common';
import {ChatComponent} from '../chat/chat.component';

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

  constructor() {
    super();
    this._loadingContainerId = 'chats-container'
  }

  public selectChat(chat: Chat) {
    this.onSelectChat.emit(chat)
  }
}
