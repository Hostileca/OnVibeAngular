import { Component } from '@angular/core';
import {ChatsListComponent} from '../../Components/chats-list/chats-list.component';
import {Chat} from '../../Data/Models/Chat/chat';
import {PageSettings} from '../../Data/Models/page-settings';
import {ChatService} from '../../Data/Services/chat.service';
import {PaginationConfig} from '../../Data/Constants/pagination-configs';

@Component({
  selector: 'app-chats',
  imports: [
    ChatsListComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  public SelectedChat: Chat | null = null
  public ChatsSource: (pageSettings: PageSettings) => Promise<Chat[]>

  constructor(private readonly _chatService: ChatService) {
    this.ChatsSource = (pageSettings: PageSettings) => this._chatService.GetAvailableChats(pageSettings)
  }

  public SelectChat(chat: Chat) {
    this.SelectedChat = chat
  }

  protected readonly PaginationConfig = PaginationConfig;
}
