import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blobUrl',
  pure: false
})
export class BlobUrlPipe implements PipeTransform {
  private url: string | null = null;
  private lastBlob: Blob | null = null;

  transform(blob: Blob | null): string | null {
    if (blob !== this.lastBlob) {
      this.revokeUrl();
      this.lastBlob = blob;
      this.url = blob ? URL.createObjectURL(blob) : null;
    }
    return this.url;
  }

  private revokeUrl() {
    if (this.url) {
      URL.revokeObjectURL(this.url);
    }
  }
}
