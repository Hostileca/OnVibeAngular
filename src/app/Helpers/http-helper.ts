import {HttpParams} from '@angular/common/http';
import {PageSettings} from '../Data/Models/Page/page-settings';

export class HttpHelper{
  static addPageSettingsToQuery(httpParams: HttpParams, pageSettings: PageSettings) : HttpParams {
    httpParams = httpParams.append('pageNumber', pageSettings.pageNumber.toString())
    httpParams = httpParams.append('pageSize', pageSettings.pageSize.toString())

    return httpParams
  }

  static fillForm(form: FormData, object: any){
    Object.entries(object).forEach(([key, value]) => {
      if (value) {
        form.append(key, value.toString());
      }
    });
  }

  static fillParams(httpParams: HttpParams, object: any) : HttpParams {
    Object.entries(object).forEach(([key, value]) => {
      if (value) {
        httpParams = httpParams.append(key, value.toString());
      }
    });
    return httpParams;
  }
}
