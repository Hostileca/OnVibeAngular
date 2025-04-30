import {Component, OnInit} from '@angular/core';
import {ItemBaseComponent} from '../item-base/item-base.component';
import {FileService} from '../../../../Data/Services/file.service';
import {Assets} from '../../../../Data/Constants/assets';
import {Comment} from '../../../../Data/Models/Comment/comment';
import {DatePipe} from '@angular/common';
import {ApiConfig} from '../../../../Data/Constants/api';

@Component({
  selector: 'app-comment',
  imports: [
    DatePipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent extends ItemBaseComponent<Comment> implements OnInit {
  public senderAvatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService) {
    super();
  }

  ngOnInit() {
    this.loadAvatar()
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.item.sender.id}/avatar`;
    this.senderAvatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly Assets = Assets;
}
