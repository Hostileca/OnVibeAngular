import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {User} from '../Models/User/user';
import {ApiConfig} from '../Constants/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getUserById(userId: string): Promise<User> {
    return await lastValueFrom(this._httpClient.get<User>(`${ApiConfig.BaseUrl}/users/${userId}`))
  }
}
