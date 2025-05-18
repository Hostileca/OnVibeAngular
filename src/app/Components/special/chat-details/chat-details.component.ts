import {Component, Input} from '@angular/core';
import {Chat} from '../../../Data/Models/Chat/chat';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {Message} from '../../../Data/Models/Message/message';
import {MessageService} from '../../../Data/Services/message.service';
import {ApiConfig} from '../../../Data/Constants/api';
import {FileService} from '../../../Data/Services/file.service';
import {MessageInputComponent} from '../message-input/message-input.component';
import {MessagesListComponent} from '../../pagination/lists/messages-list/messages-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import { Assets } from '../../../Data/Constants/assets';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChatInfoModalComponent} from '../../modals/chat-info-modal/chat-info-modal.component';

@Component({
  selector: 'app-chat-details',
  imports: [
    MessageInputComponent,
    MessagesListComponent,
  ],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.css'
})
export class ChatDetailsComponent {
  @Input() set selectedChat(chat: Chat) {
    if (chat) {
      this.loadChat(chat)
    }
  }

  public avatarUrl: string | null = null;
  public chat!: Chat;
  public messagesSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Message>>

  constructor(private readonly _messageService: MessageService,
              private readonly _fileService: FileService,
              private readonly _modalService: NgbModal) {
  }

  protected openInfo(){
    const modal = this._modalService.open(ChatInfoModalComponent, {
      size: 'lg',
      centered: true
    });
    modal.componentInstance.chat = this.chat;
  }

  private async loadChat(chat: Chat) {
    this.chat = chat;
    this.messagesSource = (pageSettings: PageSettings) => this._messageService.getChatMessages(chat.id, pageSettings);
    await this.loadAvatar();
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/chats/${this.chat.id}/image`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly PaginationConfig = PaginationConfig;
  protected readonly Assets = Assets;
}
