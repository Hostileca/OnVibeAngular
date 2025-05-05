import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './Components/special/header/header.component';
import {ChatHub} from './Data/Hubs/chat-hub';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private readonly _chatHub: ChatHub) {
  }
}
