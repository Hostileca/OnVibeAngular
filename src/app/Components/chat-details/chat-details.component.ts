import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {Chat} from '../../Data/Models/Chat/chat';
import {PageSettings} from '../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../Data/Models/Page/paged-response';
import {Message} from '../../Data/Models/Message/message';
import {ChatService} from '../../Data/Services/chat.service';
import {MessageService} from '../../Data/Services/message.service';

@Component({
  selector: 'app-chat-details',
  imports: [
    NgIf
  ],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.css'
})
export class ChatDetailsComponent {
  @Input() set SelectedChat(chat: Chat) {
    if (chat) {
      this.LoadChat(chat.id.toString())
    }
  }

  public chat!: Chat;
  public messagesSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Message>>

  constructor(private readonly _chatService: ChatService,
              private readonly _messageService: MessageService) {
  }

  private async LoadChat(chatId: string) {
    this.chat = await this._chatService.getChatById(chatId)
    this.messagesSource = (pageSettings: PageSettings) => this._messageService.getChatMessages(chatId, pageSettings);
  }
}
