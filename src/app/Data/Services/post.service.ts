import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PageSettings} from '../Models/Page/page-settings';
import {PagedResponse} from '../Models/Page/paged-response';
import {Message} from '../Models/Message/message';
import {HttpHelper} from '../../Helpers/http-helper';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';
import {Post} from '../Models/Post/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private readonly _httpClient: HttpClient) {}

  public async getUserPosts(userId: string, pageSettings: PageSettings): Promise<PagedResponse<Post>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings)
    params = params.append('userId', userId);
    return await lastValueFrom(this._httpClient.get<PagedResponse<Post>>(`${ApiConfig.BaseUrl}/posts`, {params}));
  }
}
