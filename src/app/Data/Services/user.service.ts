import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {User} from '../Models/User/user';
import {ApiConfig} from '../Constants/api';
import {UsersSearchCriteria} from '../Models/User/users-search-criteria';
import {PagedResponse} from '../Models/Page/paged-response';
import {HttpHelper} from '../../Helpers/http-helper';
import {PageSettings} from '../Models/Page/page-settings';
import {UpdateUser} from '../Models/User/update-user';

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

    if(searchCriteria.username){
      params = params.append('username', searchCriteria.username);
    }
    if(searchCriteria.country){
      params = params.append('country', searchCriteria.country);
    }
    if(searchCriteria.city){
      params = params.append('city', searchCriteria.city);
    }

    return await lastValueFrom(this._httpClient.get<PagedResponse<User>>(`${ApiConfig.BaseUrl}/users`, { params }))
  }

  public async updateUser(userId: string, updateUser: UpdateUser): Promise<User> {
    let formData = new FormData();
    formData.append('bio', updateUser.bio);
    formData.append('avatar', updateUser.avatar);
    if(updateUser.dateOfBirth){
      const date = new Date(updateUser.dateOfBirth)
      formData.append('dateOfBirth', date.toISOString());
    }
    formData.append('country', updateUser.country);
    formData.append('city', updateUser.city);

    return await lastValueFrom(this._httpClient.put<User>(`${ApiConfig.BaseUrl}/users/${userId}`, formData))
  }
}
