import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {Chat} from '../../../Data/Models/Chat/chat';
import {Message} from '../../../Data/Models/Message/message';
import {ApiConfig} from '../../../Data/Constants/api';
import {FileService} from '../../../Data/Services/file.service';
import {demandCommandFailureMessage} from '@angular/cli/src/command-builder/utilities/command';
import {AuthService} from '../../../Data/Services/auth.service';
import {Assets} from '../../../Data/Constants/assets';

@Component({
  selector: 'app-message',
  imports: [
    NgIf,
    DatePipe
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  @Input() message!: Message

  public senderAvatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService,
              private readonly _authService: AuthService) {
  }

  async ngOnInit() {
    if(!this.isSystem && !this.isOutgoing){
      await this.loadSenderAvatar()
    }
  }

  private async loadSenderAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.message.sender.id}/image`;
    this.senderAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  public get isOutgoing(): boolean {
    if(this.isSystem){
      return false
    }
    return this.message.sender.id === this._authService.userInfo?.id;
  }

  public get isSystem(): boolean {
    return !this.message.sender
  }

  protected readonly Assets = Assets;
}
