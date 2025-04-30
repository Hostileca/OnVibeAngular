import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PageSettings} from '../Models/Page/page-settings';
import {PagedResponse} from '../Models/Page/paged-response';
import {HttpHelper} from '../../Helpers/http-helper';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';
import {Comment} from '../Models/Comment/comment';
import {AddComment} from '../Models/Comment/add-comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getPostComments(postId: string, pageSettings: PageSettings): Promise<PagedResponse<Comment>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings)
    params = params.append('postId', postId);
    return await lastValueFrom(this._httpClient.get<PagedResponse<Comment>>(`${ApiConfig.BaseUrl}/comments`, {params}));
  }

  public async addComment(comment: AddComment): Promise<Comment> {
    return await lastValueFrom(this._httpClient.post<Comment>(`${ApiConfig.BaseUrl}/comments`, comment));
  }
}
