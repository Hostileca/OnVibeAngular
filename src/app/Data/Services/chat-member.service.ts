import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat} from '../Models/Chat/chat';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';

@Injectable({
  providedIn: 'root'
})
export class ChatMemberService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async addMemberToChat(chatId: string, userId: string): Promise<Chat> {
    return await lastValueFrom(this._httpClient.post<Chat>(`${ApiConfig.BaseUrl}/chats/${chatId}/members`, { userId: userId }));
  }

  public async removeMemberFromChat(chatId: string, userId: string): Promise<Chat> {
    return await lastValueFrom(this._httpClient.delete<Chat>(`${ApiConfig.BaseUrl}/chats/${chatId}/members/${userId}`));
  }
}
