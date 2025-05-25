import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Message} from '../../../../Data/Models/Message/message';
import {ApiConfig} from '../../../../Data/Constants/api';
import {FileService} from '../../../../Data/Services/file.service';
import {AuthService} from '../../../../Data/Services/auth.service';
import {Assets} from '../../../../Data/Constants/assets';
import {ItemBaseComponent} from '../item-base/item-base.component';
import {MessageContextMenuComponent} from '../../../context-menu/message-context-menu/message-context-menu.component';
import {ReactionService} from '../../../../Data/Services/reaction.service';
import {Reaction} from '../../../../Data/Models/Reaction/reaction';
import {Events} from '../../../../Data/Hubs/events';
import {EventBusService} from '../../../../Data/Services/event-bus.service';
import {LoadedAttachment} from '../../../../Data/Models/Attachment/loaded-attachment';
import {FileHelper} from '../../../../Helpers/file-helper';
import {BlobUrlPipe} from '../../../../Data/Pipes/blob-url.pipe';
import {FileSizePipe} from '../../../../Data/Pipes/file-size.pipe';
import {NgbCarousel, NgbCarouselModule, NgbSlide} from '@ng-bootstrap/ng-bootstrap';
import {AttachmentType} from '../../../../Data/Models/Attachment/attachment-type';

@Component({
  selector: 'app-message',
  imports: [
    NgIf,
    DatePipe,
    NgClass,
    MessageContextMenuComponent,
    NgForOf,
    BlobUrlPipe,
    FileSizePipe,
    NgbCarousel,
    NgbCarouselModule,
    NgbSlide
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent extends ItemBaseComponent<Message> implements OnInit {
  @ViewChild(MessageContextMenuComponent) ContextMenu!: MessageContextMenuComponent;
  public senderAvatarUrl: string | null = null;
  public groupedReactions: { [emoji: string]: number } = {};
  public loadedAttachments: LoadedAttachment[] = [];

  constructor(private readonly _fileService: FileService,
              private readonly _reactionService: ReactionService,
              private readonly _authService: AuthService,
              private readonly _eventBusService: EventBusService) {
    super();
  }

  ngOnInit() {
    if(!this.isSystem && !this.isOutgoing){
      this.loadSenderAvatar()
    }
    this.loadAttachments()
    this.startListening();
    this.groupReactions();
  }

  protected get imageAttachments() {
    return this.loadedAttachments.filter(attachment => FileHelper.isImage(attachment)) || [];
  }

  protected get otherAttachments() {
    return this.loadedAttachments.filter(attachment => !FileHelper.isImage(attachment)) || [];
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
    if(this.ContextMenu){
      this.ContextMenu.open(event.clientX, event.clientY);
    }
  }

  protected async react(emoji: string) {
    const existingReaction = this.item.reactions.find(r => r.emoji === emoji);
    if(existingReaction){
      await this._reactionService.upsertReaction({chatId: this.item.chatId, messageId: this.item.id, emoji: emoji});
    }
    await this._reactionService.upsertReaction({chatId: this.item.chatId, messageId: this.item.id});
  }

  protected isMyReaction(emoji: string) : boolean {
    return this.item.reactions.some(r => r.emoji === emoji && r.senderId === this._authService.userInfo?.id);
  }

  private async loadSenderAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.item.sender.id}/avatar`;
    this.senderAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  private groupReactions() {
    this.groupedReactions = this.item.reactions.reduce((acc, reaction) => {
      if (acc[reaction.emoji]) {
        acc[reaction.emoji]++;
      } else {
        acc[reaction.emoji] = 1;
      }
      return acc;
    }, {} as { [emoji: string]: number });
  }

  private startListening() {
    this._eventBusService.On<Reaction>(Events.ReactionSent).subscribe(this.onReactionSent);
    this._eventBusService.On<Reaction>(Events.ReactionRemoved).subscribe(this.onReactionRemoved);
  }

  private onReactionRemoved(reaction: Reaction) {
    if (this.item && reaction.messageId === this.item.id) {
      const existingIndex = this.item.reactions.findIndex(r => r.emoji === reaction.emoji && r.senderId === reaction.senderId);

      if (existingIndex !== -1) {
        this.item.reactions.splice(existingIndex, 1);
        this.groupedReactions[reaction.emoji]--;

        if (this.groupedReactions[reaction.emoji] === 0) {
          delete this.groupedReactions[reaction.emoji];
        }
      }
    }
  }

  private onReactionSent(reaction: Reaction) {
    if (this.item && reaction.messageId === this.item.id) {
      const existingReaction = this.item.reactions.find(r => r.emoji === reaction.emoji && r.senderId === reaction.senderId);

      if (!existingReaction) {
        this.item.reactions.push(reaction);
        this.groupedReactions[reaction.emoji] = (this.groupedReactions[reaction.emoji] || 0) + 1;
      }
    }
  }

  private async loadAttachments() {
    this.loadedAttachments = await Promise.all(
      this.item.attachmentsIds.map(id => this._fileService.getAttachmentBlobById(id, AttachmentType.message))
    );
  }

  protected readonly Assets = Assets;
  protected readonly Object = Object;
  protected readonly FileHelper = FileHelper;
}
