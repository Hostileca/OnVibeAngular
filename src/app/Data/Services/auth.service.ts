import { Injectable } from '@angular/core';
import {TokensResponse} from '../Models/Token/tokens-response';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {AppCookieService} from './app-cookie.service';
import { CookiesName } from '../Constants/cookies-names';
import {LoginRequest} from '../Models/User/login-request';
import {ApiConfig} from '../Constants/api';
import {catchError, lastValueFrom, Observable, tap, throwError} from 'rxjs';
import {TokenRefresh} from '../Models/Token/token-refresh';
import {RegisterRequest} from '../Models/User/register-request';
import {UserShort} from '../Models/User/user-short';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public tokens: TokensResponse | null = null

  public isAuth(): boolean{
    return !!this.tokens
  }

  constructor(private readonly _httpClient: HttpClient,
              private readonly _appCookieService: AppCookieService) {
    if(!this.tokens){
      this.tokens = this._appCookieService.get<TokensResponse>(CookiesName.Tokens)
    }
  }

  public async login(loginRequest: LoginRequest){
    return await lastValueFrom(this._httpClient.post<TokensResponse>(`${ApiConfig.BaseUrl}/users/login`, loginRequest))
  }

  public async register(registerRequest: RegisterRequest){
    return await lastValueFrom(this._httpClient.post<UserShort>(`${ApiConfig.BaseUrl}/users/register`, registerRequest));
  }

  public refreshAuthToken():Observable<TokensResponse>{
    if (this.tokens === null) {
      return throwError(new Error('Tokens are null'));
    }
    const tokenRefreshRequest: TokenRefresh = {
      refreshToken: this.tokens.refreshToken.value
    };

    return this._httpClient.post<TokensResponse>(`${ApiConfig.BaseUrl}/users/tokens/refresh`, tokenRefreshRequest)
      .pipe(
        tap(tokenResponse => { this.saveTokens(tokenResponse) }),
        catchError(error => {
          this.logout()
          return throwError(error)
        })
      )
  }

  private saveTokens(tokens: TokensResponse){
    this.tokens = tokens
    this._appCookieService.save<TokensResponse>(CookiesName.Tokens, this.tokens)
  }

  public logout(){
    this.tokens = null
    this._appCookieService.delete(CookiesName.Tokens)
  }
}

