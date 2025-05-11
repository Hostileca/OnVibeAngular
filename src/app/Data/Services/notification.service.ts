import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';
import {Notification} from '../Models/Notifications/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async getNotifications(isRead: boolean): Promise<Notification[]> {
    let params = new HttpParams();
    params = params.append('isRead', isRead);
    return await lastValueFrom(this._httpClient.get<Notification[]>(`${ApiConfig.BaseUrl}/notifications`, {params}));
  }
}
