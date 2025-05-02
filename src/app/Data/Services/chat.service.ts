import { Injectable } from '@angular/core';
import {PageSettings} from '../Models/Page/page-settings';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiConfig} from '../Constants/api';
import {HttpHelper} from '../../Helpers/http-helper';
import {Chat} from '../Models/Chat/chat';
import {lastValueFrom} from 'rxjs';
import {PagedResponse} from '../Models/Page/paged-response';
import {CreateChat} from '../Models/Chat/create-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getAvailableChats(pageSettings: PageSettings): Promise<PagedResponse<Chat>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings);
    return await lastValueFrom(
      this._httpClient.get<PagedResponse<Chat>>(`${ApiConfig.BaseUrl}/chats/my`, { params })
    );
  }

  public async getChatById(chatId: string): Promise<Chat> {
    return await lastValueFrom(this._httpClient.get<Chat>(`${ApiConfig.BaseUrl}/chats/${chatId}`));
  }

  public async createChat(createChat: CreateChat): Promise<Chat> {
    let formData = new FormData();
    formData.append('name', createChat.name);
    formData.append('image', createChat.image);
    createChat.userIds.forEach(userId => {
      formData.append('userIds', userId);
    });
    return await lastValueFrom(this._httpClient.post<Chat>(`${ApiConfig.BaseUrl}/chats`, formData));
  }
}
