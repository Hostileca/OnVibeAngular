import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {Message} from '../../../../Data/Models/Message/message';
import {ApiConfig} from '../../../../Data/Constants/api';
import {FileService} from '../../../../Data/Services/file.service';
import {AuthService} from '../../../../Data/Services/auth.service';
import {Assets} from '../../../../Data/Constants/assets';
import {ItemBaseComponent} from '../item-base/item-base.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateChatComponent} from '../../../modals/create-chat-modal/create-chat-modal.component';
import {MessageContextModalComponent} from '../../../modals/message-context-modal/message-context-modal.component';

@Component({
  selector: 'app-message',
  imports: [
    NgIf,
    DatePipe,
    NgClass
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent extends ItemBaseComponent<Message> implements OnInit {
  @ViewChild('messageElement') messageElement!: ElementRef;
  public senderAvatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService,
              private readonly _authService: AuthService,
              private readonly _modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    if(!this.isSystem && !this.isOutgoing){
      this.loadSenderAvatar()
    }
  }

  protected get isOutgoing(): boolean {
    if(this.isSystem){
      return false
    }
    return this.item.sender.id === this._authService.userInfo?.id;
  }

  protected get isSystem(): boolean {
    return !this.item.sender
  }

  protected onRightClick(event: MouseEvent): void {
    event.preventDefault();
    const contextModal = this._modalService.open(MessageContextModalComponent, {
      size: 'sm',
      centered: false,
      backdrop: false
    });
    contextModal.componentInstance.message = this.item;
    contextModal.componentInstance.position = { x: event.clientX - 800, y: event.clientY - 20 } // todo: magic numbers!
  }

  private async loadSenderAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.item.sender.id}/image`;
    this.senderAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly Assets = Assets;
}
