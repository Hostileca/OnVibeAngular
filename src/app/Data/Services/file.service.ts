import { Injectable } from '@angular/core';
import {lastValueFrom} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiConfig} from '../Constants/api';
import {AttachmentType} from '../Models/Attachment/attachment-type';

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
      if (!blob || !(blob instanceof Blob) || !blob.size) {
        return null;
      }

      return this.blobToDataUrl(blob);
    }
    catch (error) {
      throw error;
    }
  }

  public async getAttachmentBlobById(id: string, type: AttachmentType): Promise<{ blob: Blob, fileName: string }> {
    let params = new HttpParams();
    params = params.append('type', type);
    const response = await lastValueFrom(
      this._httpClient.get(`${ApiConfig.BaseUrl}/attachments/${id}`, {
        responseType: 'blob',
        observe: 'response',
        params: params
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
}
