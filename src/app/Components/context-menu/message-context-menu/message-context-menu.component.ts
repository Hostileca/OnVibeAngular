import {Component, Input} from '@angular/core';
import {Message} from '../../../Data/Models/Message/message';
import {ContextMenuBaseComponent} from '../context-menu-base/context-menu-base.component';
import {NgForOf, NgIf} from '@angular/common';
import {ExtendedReactionsList, QuickReactionsList} from '../../../Data/Constants/reactions';
import {ReactionService} from '../../../Data/Services/reaction.service';

@Component({
  selector: 'app-message-context-menu',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './message-context-menu.component.html',
  styleUrl: './message-context-menu.component.css'
})
export class MessageContextMenuComponent extends ContextMenuBaseComponent{
  @Input() message!: Message;
  @Input() position?: { x: number, y: number };

  constructor(private readonly _reactionService: ReactionService) {
    super();
  }
  protected copyMessage() {
    if (this.message) {
      navigator.clipboard.writeText(this.message.text)
    }
  }

  protected async react(emoji: string){
    await this._reactionService.upsertReaction({messageId: this.message.id, emoji});
  }

  protected readonly QuickReactionsList = QuickReactionsList;
  protected readonly ExtendedReactionsList = ExtendedReactionsList;
}
