import {LoadedAttachment} from '../Data/Models/Attachment/loaded-attachment';

export class FileHelper {
  public static isImage(attachment: LoadedAttachment){
    return attachment.blob.type.startsWith('image/');
  }

  public static getFileIcon(file: any): string {
    if (file.type?.includes('pdf')) return 'bi-file-earmark-pdf';
    if (file.type?.includes('word')) return 'bi-file-earmark-word';
    if (file.type?.includes('video')) return 'bi-file-earmark-play';
    return 'bi-file-earmark';
  }
}
