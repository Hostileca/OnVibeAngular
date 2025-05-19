import {Component, Input, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageService} from '../../../Data/Services/message.service';
import {NgForOf, NgIf} from '@angular/common';
import {
  SendMessageContextMenuComponent
} from '../../context-menu/send-message-context-menu/send-message-context-menu.component';

@Component({
  selector: 'app-message-input',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    SendMessageContextMenuComponent
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent{
  @ViewChild(SendMessageContextMenuComponent) ContextMenu!: SendMessageContextMenuComponent;
  @Input() set targetChatId(chatId: string) {
    if (chatId) {
      this.form.get('chatId')?.setValue(chatId);
    }
  }

  constructor(private readonly _messageService: MessageService) {
  }

  public form: FormGroup = new FormGroup({
    text: new FormControl(null),
    attachments: new FormControl<File[]>([]),
    chatId: new FormControl(null),
    date: new FormControl<Date | null>(null),
  });

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const currentFiles = this.form.get('attachments')?.value || [];

      const newFiles = [...currentFiles, ...Array.from(input.files)];

      this.form.patchValue({
        attachments: newFiles
      });
    }
  }

  public async removeAttachment(index: number) {
    const attachments = this.form.get('attachments')?.value || [];
    attachments.splice(index, 1);
    this.form.patchValue({
      attachments: [...attachments]
    });
  }

  public async onSubmit() {
    const chatId = this.form.get('chatId')?.value;
    await this._messageService.sendMessage(this.form.value);

    this.form.reset();
    this.form.get('chatId')?.setValue(chatId);
    this.form.patchValue({
      attachments: []
    });
  }

  protected onSendRightClick(event: MouseEvent): void {
    event.preventDefault();
    if(this.ContextMenu){
      this.ContextMenu.open(event.clientX-250, event.clientY-80);
    }
  }
}
