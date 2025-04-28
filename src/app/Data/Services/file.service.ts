import { Injectable } from '@angular/core';
import {lastValueFrom} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ApiConfig} from '../Constants/api';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private readonly _httpClient: HttpClient) {}

  public async loadImageAsDataUrl(url: string): Promise<string | null> {
    try {
      const response = await lastValueFrom(
        this._httpClient.get(url, {
          responseType: 'blob',
          observe: 'response'
        })
      );

      const blob = response.body;
      if (!blob || !(blob instanceof Blob)) {
        return null;
      }

      return this.blobToDataUrl(blob);
    }
    catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return null;
      }
      throw error;
    }
  }


  public async getAttachmentBlobById(id: string): Promise<{ blob: Blob, fileName: string }> {
    const response = await lastValueFrom(
      this._httpClient.get(`${ApiConfig.BaseUrl}/attachments/${id}`, {
        responseType: 'blob',
        observe: 'response'
      })
    );

    const blob = response.body as Blob;

    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = 'unknown';

    if (contentDisposition) {
      const matches = /filename="(.+)"/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1];
      }

      if (fileName === 'unknown') {
        const matchesUtf8 = /filename\*=UTF-8''(.+)/.exec(contentDisposition);
        if (matchesUtf8 != null && matchesUtf8[1]) {
          fileName = matchesUtf8[1];
        }
      }
    }

    return { blob, fileName };
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read blob data'));

      reader.readAsDataURL(blob);
    });
  }

  private is404Error(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 404;
  }
}
