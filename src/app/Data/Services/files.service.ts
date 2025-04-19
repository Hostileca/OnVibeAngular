import { Injectable } from '@angular/core';
import {lastValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(private httpClient: HttpClient) {}

  async loadImageAsDataUrl(url: string): Promise<string> {
    try {
      const blob = await lastValueFrom(
        this.httpClient.get(url, { responseType: 'blob' })
      );

      if (!(blob instanceof Blob)) {
        throw new Error('Invalid response type');
      }

      return await this.blobToDataUrl(blob);
    } catch (error) {
      console.error('Image loading failed:', error);
      throw error;
    }
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
