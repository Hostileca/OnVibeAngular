import {Component, OnInit} from '@angular/core';
import {Post} from '../../../../Data/Models/Post/post';
import {FileService} from '../../../../Data/Services/file.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ApiConfig} from '../../../../Data/Constants/api';
import {Assets} from '../../../../Data/Constants/assets';
import {NgbCarousel, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {FileSizePipe} from '../../../../Data/Pipes/file-size.pipe';
import {LoadedAttachment} from '../../../../Data/Models/Attachment/loaded-attachment';
import {BlobUrlPipe} from '../../../../Data/Pipes/blob-url.pipe';
import {LikeService} from '../../../../Data/Services/like.service';
import {ItemBaseComponent} from '../item-base/item-base.component';
import {CommentsListComponent} from '../../lists/comments-list/comments-list.component';
import {PaginationConfig} from '../../../../Data/Constants/pagination-configs';
import {PagedResponse} from '../../../../Data/Models/Page/paged-response';
import {Comment} from '../../../../Data/Models/Comment/comment';
import {PageSettings} from '../../../../Data/Models/Page/page-settings';
import {CommentService} from '../../../../Data/Services/comment.service';
import {FileHelper} from '../../../../Helpers/file-helper';
import {AttachmentType} from '../../../../Data/Models/Attachment/attachment-type';

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
    BlobUrlPipe,
    CommentsListComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent extends ItemBaseComponent<Post> implements OnInit {
  public ownerAvatarUrl: string | null = null;
  public loadedAttachments: LoadedAttachment[] = [];
  public commentsSource: (pageSettings: PageSettings) => Promise<PagedResponse<Comment>>;
  public showComment: boolean = false;

  protected get imageAttachments() {
    return this.loadedAttachments.filter(attachment => FileHelper.isImage(attachment)) || [];
  }

  protected get otherAttachments() {
    return this.loadedAttachments.filter(attachment => !FileHelper.isImage(attachment)) || [];
  }

  constructor(private readonly _fileService: FileService,
              private readonly _likeService: LikeService,
              private readonly _commentService: CommentService) {
    super();
    this.commentsSource = (pageSettings: PageSettings) => this._commentService.getPostComments(this.item.id, pageSettings);
  }

  ngOnInit() {
    this.loadOwnerAvatar();
    this.loadAttachments();
  }

  private async loadOwnerAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.item.owner.id}/image`;
    this.ownerAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  private async loadAttachments() {
    this.loadedAttachments = await Promise.all(
      this.item.attachmentsIds.map(id => this._fileService.getAttachmentBlobById(id, AttachmentType.post))
    );
  }

  protected async toggleLike(){
    const like = await this._likeService.upsertLike(this.item.id)
    this.item.isLiked = like.isLiked;
    this.item.likesCount = like.likesCount;
  }

  protected toggleComments(){
    this.showComment = !this.showComment;
  }

  protected readonly Assets = Assets;
  protected readonly PaginationConfig = PaginationConfig;
  protected readonly FileHelper = FileHelper;
}
