import {Component, EventEmitter, Output} from '@angular/core';
import { PaginationBaseComponent } from '../pagination-base-component/pagination-base.component';
import {Chat} from '../../Models/Chat/chat';

@Component({
  selector: 'app-chats-list',
  imports: [],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css'
})
export class ChatsListComponent extends PaginationBaseComponent<Chat>{
  @Output() OnSelectChat = new EventEmitter<Chat>();

  constructor() {
    super();
    this._loadingContainerId = 'chats-container'
  }

  public SelectChat(chat: Chat) {
    this.OnSelectChat.emit(chat)
  }
}
