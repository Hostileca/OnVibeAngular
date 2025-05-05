import {Component, Input} from '@angular/core';
import {Message} from '../../../Data/Models/Message/message';
import {ContextMenuBaseComponent} from '../context-menu-base/context-menu-base.component';
import {MessageComponent} from '../../pagination/items/message/message.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-message-context-menu',
  imports: [
    NgIf
  ],
  templateUrl: './message-context-menu.component.html',
  styleUrl: './message-context-menu.component.css'
})
export class MessageContextMenuComponent extends ContextMenuBaseComponent{
  @Input() message!: Message;
  @Input() position?: { x: number, y: number };

  protected copyMessage() {
    if (this.message) {
      navigator.clipboard.writeText(this.message.text)
    }
  }

  protected openReactionsMenu() {
    console.log('context ', this.message.id);
  }
}
