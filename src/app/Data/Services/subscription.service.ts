import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';
import {Subscription} from '../Models/Subscription/subscription';
import {PagedResponse} from '../Models/Page/paged-response';
import {PageSettings} from '../Models/Page/page-settings';
import {HttpHelper} from '../../Helpers/http-helper';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async upsertSubscription(userId: string) : Promise<Subscription> {
    return await lastValueFrom(this._httpClient.put<Subscription>(`${ApiConfig.BaseUrl}/subscriptions/${userId}`, ''))
  }

  public async getSubscriptions(userId: string, pageSettings: PageSettings): Promise<PagedResponse<Subscription>>{
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings);
    params = params.append("type", 1);
    params = params.append("userId", userId);
    return await lastValueFrom(this._httpClient.get<PagedResponse<Subscription>>(`${ApiConfig.BaseUrl}/subscriptions`, { params }));
  }

  public async getSubscribers(userId: string, pageSettings: PageSettings): Promise<PagedResponse<Subscription>>{
    let params = new HttpParams();
    params = HttpHelper.addPageSettingsToQuery(params, pageSettings);
    params = params.append("type", 0);
    params = params.append("userId", userId);
    return await lastValueFrom(this._httpClient.get<PagedResponse<Subscription>>(`${ApiConfig.BaseUrl}/subscriptions`, { params }));
  }
}
