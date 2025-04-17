import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-message',
    imports: [
        NgIf
    ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

}
