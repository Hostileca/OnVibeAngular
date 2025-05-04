import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {Chat} from '../../../../Data/Models/Chat/chat';
import {ApiConfig} from '../../../../Data/Constants/api';
import {FileService} from '../../../../Data/Services/file.service';
import {Assets} from "../../../../Data/Constants/assets";
import {ItemBaseComponent} from '../item-base/item-base.component';
import {Events} from '../../../../Data/Hubs/events';
import {Message} from '../../../../Data/Models/Message/message';
import {EventBusService} from '../../../../Data/Services/event-bus.service';

@Component({
  selector: 'app-chat',
  imports: [
    NgIf,
    DatePipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent extends ItemBaseComponent<Chat> implements OnInit {
  public avatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService,
              private readonly _eventBusService: EventBusService) {
    super();
  }

  ngOnInit() {
    this.loadImage();
    this.startListening();
  }

  private async loadImage(){
    const url = `${ApiConfig.BaseUrl}/chats/${this.item.id}/image`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  private startListening(){
    this._eventBusService.On<Message>(Events.MessageSent).subscribe(message => {
      if(message.chatId == this.item.id){
        this.item.preview = message;
      }
    })
  }

  protected readonly Assets = Assets;
}
