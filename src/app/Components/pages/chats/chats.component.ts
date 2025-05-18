import { Component } from '@angular/core';
import {ChatsListComponent} from '../../pagination/lists/chats-list/chats-list.component';
import {Chat} from '../../../Data/Models/Chat/chat';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {ChatService} from '../../../Data/Services/chat.service';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {ChatDetailsComponent} from '../../special/chat-details/chat-details.component';
import {NgIf} from '@angular/common';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateChatComponent} from '../../modals/create-chat-modal/create-chat-modal.component';

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
  public selectedChat!: Chat
  public chatsSource: (pageSettings: PageSettings) => Promise<PagedResponse<Chat>>

  constructor(private readonly _chatService: ChatService,
              private readonly _modalService: NgbModal) {
    this.chatsSource = (pageSettings: PageSettings) => this._chatService.getAvailableChats(pageSettings)
  }

  public selectChat(chat: Chat) {
    this.selectedChat = chat
  }

  public openCreateChatModal() {
    this._modalService.open(CreateChatComponent, {
      size: 'lg',
      centered: true
    });
  }

  protected readonly PaginationConfig = PaginationConfig;
}
