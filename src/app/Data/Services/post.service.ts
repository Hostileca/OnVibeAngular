import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PageSettings} from '../Models/Page/page-settings';
import {PagedResponse} from '../Models/Page/paged-response';
import {HttpHelper} from '../../Helpers/http-helper';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';
import {Post} from '../Models/Post/post';
import {CreatePost} from '../Models/Post/create-post';

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

  public async createPost(createPost: CreatePost): Promise<Post> {
    let formData = new FormData();
    if(createPost.content){
      formData.append('content', createPost.content);
    }
    if(createPost.attachments){
      for (const attachment of createPost.attachments){
        formData.append('attachments', attachment);
      }
    }

    return await lastValueFrom(this._httpClient.post<Post>(`${ApiConfig.BaseUrl}/posts`, formData));
  }

  public async getWall(pageSettings: PageSettings): Promise<PagedResponse<Post>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings)
    return await lastValueFrom(this._httpClient.get<PagedResponse<Post>>(`${ApiConfig.BaseUrl}/posts/wall`, {params}));
  }
}
