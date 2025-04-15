import { Injectable } from '@angular/core';
import {TokensResponse} from '../Models/Token/tokens-response';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {AppCookieService} from './app-cookie.service';
import { CookiesName } from '../Constants/cookies-names';
import {LoginRequest} from '../Models/User/login-request';
import {ApiConfig} from '../Constants/api';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TokenRefresh} from '../Models/Token/token-refresh';
import {RegisterRequest} from '../Models/User/register-request';
import {UserShort} from '../Models/User/user-short';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public Tokens: TokensResponse | null = null

  public IsAuth(): boolean{
    return !!this.Tokens
  }

  constructor(private readonly _router: Router,
              private readonly _httpClient: HttpClient,
              private readonly _appCookieService: AppCookieService) {
    if(!this.Tokens){
      this.Tokens = this._appCookieService.Get<TokensResponse>(CookiesName.Tokens)
    }
  }

  public async Login(loginRequest: LoginRequest){
    try {
      const response = await this._httpClient.post<TokensResponse>(
        `${ApiConfig.BaseUrl}/users/login`,
        loginRequest
      ).toPromise();

      this.SaveTokens(response!);
    }
    catch (error) {
      console.error(error)
    }
  }

  public async Register(registerRequest: RegisterRequest){
    try {
      const response = this._httpClient.post<UserShort>(`${ApiConfig.BaseUrl}/users/register`, registerRequest).toPromise();
    }
    catch (error) {
      console.error(error)
    }
  }

  public RefreshAuthToken():Observable<TokensResponse>{
    if (this.Tokens === null) {
      return throwError(new Error('Tokens are null'));
    }
    const tokenRefreshRequest: TokenRefresh = {
      refreshToken: this.Tokens.refreshToken.value
    };

    return this._httpClient.post<TokensResponse>(`${ApiConfig.BaseUrl}/users/tokens/refresh`, tokenRefreshRequest)
      .pipe(
        tap(tokenResponse => { this.SaveTokens(tokenResponse) }),
        catchError(error => {
          this.Logout()
          return throwError(error)
        })
      )
  }

  private SaveTokens(tokens: TokensResponse){
    this.Tokens = tokens
    this._appCookieService.Save<TokensResponse>(CookiesName.Tokens, this.Tokens)
  }

  public Logout(){
    this.Tokens = null
    this._appCookieService.Delete(CookiesName.Tokens)
  }
}

