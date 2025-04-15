import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {Chat} from '../../Models/Chat/chat';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [
    NgIf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @Input() Chat!: Chat
  @Output() OnSelectChat = new EventEmitter<Chat>();

  constructor() {
  }

  public SelectChat() {
    this.OnSelectChat.emit(this.Chat);
  }
}
