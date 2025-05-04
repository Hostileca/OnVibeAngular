import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SendReaction} from '../Models/Reaction/send-reaction';
import {lastValueFrom} from 'rxjs';
import {PagedResponse} from '../Models/Page/paged-response';
import {Post} from '../Models/Post/post';
import {ApiConfig} from '../Constants/api';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  constructor(private readonly _httpClient: HttpClient) { }

  public async upsertReaction(sendReaction: SendReaction): Promise<void> {
    await lastValueFrom(this._httpClient.put(`${ApiConfig.BaseUrl}/reactions`, sendReaction))
  }
}
