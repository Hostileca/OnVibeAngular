import { Injectable } from '@angular/core';
import {PageSettings} from '../Models/Page/page-settings';
import {PagedResponse} from '../Models/Page/paged-response';
import {HttpHelper} from '../../Helpers/http-helper';
import {Message} from '../Models/Message/message';
import {ApiConfig} from '../Constants/api';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getChatMessages(chatId: string, pageSettings: PageSettings): Promise<PagedResponse<Message>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings)
    return await lastValueFrom(this._httpClient.get<PagedResponse<Message>>(`${ApiConfig.BaseUrl}/chats/${chatId}/messages`, {params}));
  }
}
