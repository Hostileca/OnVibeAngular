import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Chat} from '../../Data/Models/Chat/chat';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../Data/Constants/api';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    NgIf,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @Input() chat!: Chat
  @Output() selected = new EventEmitter<Chat>();

  public avatarUrl: string = '';

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.loadAvatar();
  }

  private async loadAvatar() {
    if (!this.chat?.id) {
      console.error('Chat ID is not defined');
      return;
    }

    try {
      const blob = await lastValueFrom(
        this.httpClient.get(`${ApiConfig.BaseUrl}/chats/${this.chat.id}/image`, {
          responseType: 'blob'
        })
      );

      if (blob instanceof Blob) {
        await this.createImageFromBlob(blob);
      } else {
        throw new Error('Invalid response type');
      }
    } catch (error) {
      console.error('Failed to load avatar:', error);
    }
  }

  private createImageFromBlob(blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        this.avatarUrl = reader.result as string;
        resolve();
      };

      reader.onerror = () => {
        reject(new Error('Failed to read blob data'));
      };

      reader.readAsDataURL(blob);
    });
  }

  public selectChat() {
    this.selected.emit(this.chat);
  }
}
