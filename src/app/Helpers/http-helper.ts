import {HttpParams} from '@angular/common/http';
import {PageSettings} from '../Data/Models/page-settings';

export class HttpHelper{
  static AddPageSettingsToQuery(httpParams: HttpParams, pageSettings: PageSettings) : HttpParams{
    httpParams = httpParams.append('pageNumber', pageSettings.pageNumber.toString())
    httpParams = httpParams.append('pageSize', pageSettings.pageSize.toString())

    return httpParams
  }
}
