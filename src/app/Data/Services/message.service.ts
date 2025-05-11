import { Injectable } from '@angular/core';
import {PageSettings} from '../Models/Page/page-settings';
import {PagedResponse} from '../Models/Page/paged-response';
import {HttpHelper} from '../../Helpers/http-helper';
import {Message} from '../Models/Message/message';
import {ApiConfig} from '../Constants/api';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {SendMessage} from '../Models/Message/send-message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getChatMessages(chatId: string, pageSettings: PageSettings): Promise<PagedResponse<Message>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings)
    params = params.append('chatId', chatId);
    return await lastValueFrom(this._httpClient.get<PagedResponse<Message>>(`${ApiConfig.BaseUrl}/messages`, {params}));
  }

  public async sendMessage(message: SendMessage): Promise<Message> {
    let formData = new FormData();
    if (message.text){
      formData.append('text', message.text);
    }
    formData.append('chatId', message.chatId);
    if(message.attachments){
      for (const attachment of message.attachments){
        formData.append('attachments', attachment);
      }
    }

    return await lastValueFrom(this._httpClient.post<Message>(`${ApiConfig.BaseUrl}/messages`, formData));
  }
}
