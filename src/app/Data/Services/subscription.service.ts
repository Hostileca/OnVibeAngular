import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';
import {Subscription} from '../Models/Subscription/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async upsertSubscription(userId: string){
    return await lastValueFrom(this._httpClient.put<Subscription>(`${ApiConfig.BaseUrl}/subscriptions/${userId}`, ''))
  }
}
