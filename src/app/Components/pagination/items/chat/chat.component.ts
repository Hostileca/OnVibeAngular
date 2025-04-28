import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {Chat} from '../../../../Data/Models/Chat/chat';
import {ApiConfig} from '../../../../Data/Constants/api';
import {FileService} from '../../../../Data/Services/file.service';
import {Assets} from "../../../../Data/Constants/assets";
import {ItemBaseComponent} from '../item-base/item-base.component';

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

  constructor(private readonly _fileService: FileService) {
    super();
  }

  async ngOnInit() {
    await this.loadImage()
  }

  private async loadImage(){
    const url = `${ApiConfig.BaseUrl}/chats/${this.item.id}/image`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly Assets = Assets;
}
