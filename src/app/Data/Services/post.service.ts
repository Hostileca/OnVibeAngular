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

  public async createPost(post: CreatePost): Promise<Post> {
    let formData = new FormData();
    HttpHelper.fillForm(formData, post)
    return await lastValueFrom(this._httpClient.post<Post>(`${ApiConfig.BaseUrl}/posts`, formData));
  }
}
