import { Component } from '@angular/core';
import {ChatsListComponent} from '../../Components/chats-list/chats-list.component';
import {Chat} from '../../Data/Models/Chat/chat';
import {PageSettings} from '../../Data/Models/Page/page-settings';
import {ChatService} from '../../Data/Services/chat.service';
import {PaginationConfig} from '../../Data/Constants/pagination-configs';
import {ChatDetailsComponent} from '../../Components/chat-details/chat-details.component';
import {NgIf} from '@angular/common';
import {PagedResponse} from '../../Data/Models/Page/paged-response';

@Component({
  selector: 'app-chats',
  imports: [
    ChatsListComponent,
    ChatDetailsComponent,
    NgIf
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  public SelectedChat: Chat | null = null
  public ChatsSource: (pageSettings: PageSettings) => Promise<PagedResponse<Chat>>

  constructor(private readonly _chatService: ChatService) {
    this.ChatsSource = (pageSettings: PageSettings) => this._chatService.getAvailableChats(pageSettings)
  }

  public SelectChat(chat: Chat) {
    this.SelectedChat = chat
  }

  protected readonly PaginationConfig = PaginationConfig;
}
