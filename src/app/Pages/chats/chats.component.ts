import { Component } from '@angular/core';
import {ChatsListComponent} from '../../Components/chats-list/chats-list.component';

@Component({
  selector: 'app-chats',
  imports: [
    ChatsListComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {

}
