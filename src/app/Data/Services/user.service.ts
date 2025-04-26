import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {User} from '../Models/User/user';
import {ApiConfig} from '../Constants/api';
import {UsersSearchCriteria} from '../Models/User/users-search-criteria';
import {PagedResponse} from '../Models/Page/paged-response';
import {HttpHelper} from '../../Helpers/http-helper';
import {PageSettings} from '../Models/Page/page-settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getUserById(userId: string): Promise<User> {
    return await lastValueFrom(this._httpClient.get<User>(`${ApiConfig.BaseUrl}/users/${userId}`))
  }

  public async getUsers(searchCriteria: UsersSearchCriteria, pageSettings: PageSettings): Promise<PagedResponse<User>> {
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings)
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value) {
        params = params.append(key, value.toString());
      }
    });
    return await lastValueFrom(this._httpClient.get<PagedResponse<User>>(`${ApiConfig.BaseUrl}/users`, { params }))
  }
}
