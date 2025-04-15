import {Token} from './token';

export interface TokensResponse {
  accessToken: Token;
  refreshToken: Token;
}
