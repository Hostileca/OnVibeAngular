import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../Data/Models/Post/post';
import {FileService} from '../../../Data/Services/file.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ApiConfig} from '../../../Data/Constants/api';
import {Assets} from '../../../Data/Constants/assets';

@Component({
  selector: 'app-post',
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  public ownerAvatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService) {
  }

  async ngOnInit() {
    await this.loadOwnerAvatar()
  }

  public async getAttachmentUrl(attachmentId: string){
    return await this._fileService.getAttachmentBlobUrlById(attachmentId)
  }

  private async loadOwnerAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.post.owner.id}/image`;
    this.ownerAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly Assets = Assets;
}
