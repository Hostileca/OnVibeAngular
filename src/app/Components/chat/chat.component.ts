import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Chat} from '../../Data/Models/Chat/chat';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../Data/Constants/api';
import {lastValueFrom} from 'rxjs';
import {FilesService} from '../../Data/Services/files.service';

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

  public avatarUrl: string = '';

  constructor(private readonly _filesService: FilesService) {
  }

  async ngOnInit() {
    await this.loadAvatar()
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/chats/${this.chat.id}/image`;
    this.avatarUrl = await this._filesService.loadImageAsDataUrl(url)
  }

  public selectChat() {
    this.selected.emit(this.chat);
  }
}
