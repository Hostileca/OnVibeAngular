import {Component, Input} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {Chat} from '../../Data/Models/Chat/chat';
import {Message} from '../../Data/Models/Message/message';

@Component({
  selector: 'app-message',
  imports: [
    NgIf,
    DatePipe
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message!: Message
}
