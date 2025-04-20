import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Chat} from '../../Data/Models/Chat/chat';
import {MessageService} from '../../Data/Services/message.service';

@Component({
  selector: 'app-message-input',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent{
  @Input() set targetChatId(chatId: string) {
    if (chatId) {
      this.form.get('chatId')?.setValue(chatId);
    }
  }

  constructor(private readonly _messageService: MessageService) {
  }

  public form: FormGroup = new FormGroup({
    text: new FormControl(null),
    chatId: new FormControl(null)
  });

  public async onSubmit() {
    await this._messageService.sendMessage(this.form.value)
  }
}
