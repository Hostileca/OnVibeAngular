import { Component } from '@angular/core';
import {PaginationBaseComponent} from '../pagination-base-component/pagination-base.component';
import {Message} from '../../../Data/Models/Message/message';
import {NgForOf} from '@angular/common';
import {MessageComponent} from '../../items/message/message.component';

@Component({
  selector: 'app-messages-list',
  imports: [
    NgForOf,
    MessageComponent
  ],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent extends PaginationBaseComponent<Message> {
  constructor() {
    super();
    this._loadingContainerId = 'messages-container'
  }
}
