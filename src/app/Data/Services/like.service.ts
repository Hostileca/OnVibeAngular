import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Like} from '../Models/Like/like';
import {lastValueFrom} from 'rxjs';
import {ApiConfig} from '../Constants/api';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(private readonly _httpClient: HttpClient) { }

  public upsertLike(postId: string) : Promise<Like>{
    return lastValueFrom(this._httpClient.put<Like>(`${ApiConfig.BaseUrl}/likes`, { postId }))
  }
}
