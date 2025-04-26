import { Injectable } from '@angular/core';
import {lastValueFrom} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {addWarning} from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import {ApiConfig} from '../Constants/api';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private readonly _httpClient: HttpClient) {}

  public async loadImageAsDataUrl(url: string): Promise<string | null> {
    try {
      const blob = await lastValueFrom(
        this._httpClient.get(url, {
          responseType: 'blob',
          observe: 'response'
        })
      );

      if (blob.status === 404) {
        return null;
      }

      if (!(blob.body instanceof Blob)) {
        throw new Error('Invalid response type: expected Blob');
      }

      return await this.blobToDataUrl(blob.body);
    } catch (error) {
      if (this.is404Error(error)) {
        return null;
      }
      console.error('Image loading failed:', error);
      throw error;
    }
  }

  public async getAttachmentBlobUrlById(id: string): Promise<string> {
    const blobResponse = await lastValueFrom(
      this._httpClient.get(`${ApiConfig.BaseUrl}/attachments`, {
        responseType: 'blob',
        observe: 'response'
      }))

    return URL.createObjectURL(blobResponse.body as Blob);
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
