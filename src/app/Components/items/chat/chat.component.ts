import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Chat} from '../../../Data/Models/Chat/chat';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../Data/Constants/api';
import {lastValueFrom} from 'rxjs';
import {FileService} from '../../../Data/Services/file.service';
import {Assets} from "../../../Data/Constants/assets";

@Component({
  selector: 'app-chat',
  imports: [
    NgIf,
    DatePipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @Input() chat!: Chat
  @Output() selected = new EventEmitter<Chat>();

  public avatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService) {
  }

  async ngOnInit() {
    await this.loadImage()
  }

  private async loadImage(){
    const url = `${ApiConfig.BaseUrl}/chats/${this.chat.id}/image`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  public selectChat() {
    this.selected.emit(this.chat);
  }

    protected readonly Assets = Assets;
}
