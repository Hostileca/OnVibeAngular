import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../Data/Models/Post/post';
import {FileService} from '../../../Data/Services/file.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ApiConfig} from '../../../Data/Constants/api';
import {Assets} from '../../../Data/Constants/assets';
import {NgbCarousel, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {FileSizePipe} from '../../../Data/Pipes/file-size.pipe';
import {LoadedAttachment} from '../../../Data/Models/Attachment/loaded-attachment';
import {BlobUrlPipe} from '../../../Data/Pipes/blob-url.pipe';
import {LikeService} from '../../../Data/Services/like.service';

@Component({
  selector: 'app-post',
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgbCarousel,
    NgbCarouselModule,
    NgClass,
    FileSizePipe,
    BlobUrlPipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  @Input() post!: Post;

  public ownerAvatarUrl: string | null = null;
  public loadedAttachments: LoadedAttachment[] = [];

  protected get imageAttachments() {
    return this.loadedAttachments.filter(attachment => this.isImage(attachment)) || [];
  }

  protected get otherAttachments() {
    return this.loadedAttachments.filter(attachment => !this.isImage(attachment)) || [];
  }

  constructor(private readonly _fileService: FileService,
              private readonly _likeService: LikeService,
              private readonly _cdRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    await this.loadOwnerAvatar();
    await this.loadAttachments();
  }

  private async loadOwnerAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.post.owner.id}/image`;
    this.ownerAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  private async loadAttachments() {
    this.loadedAttachments = await Promise.all(
      this.post.attachmentsIds.map(id => this._fileService.getAttachmentBlobById(id))
    );
  }

  protected isImage(attachment: LoadedAttachment){
    return attachment.blob.type.startsWith('image/');
  }

  protected getFileIcon(file: any): string {
    if (file.type?.includes('pdf')) return 'bi-file-earmark-pdf';
    if (file.type?.includes('word')) return 'bi-file-earmark-word';
    if (file.type?.includes('video')) return 'bi-file-earmark-play';
    return 'bi-file-earmark';
  }

  protected async toggleLike(){
    const like = await this._likeService.upsertLike(this.post.id)
    this.post.isLiked = like.isLiked;
    this.post.likesCount = like.likesCount;
  }

  protected toggleComments(){
  }

  protected readonly Assets = Assets;
}
