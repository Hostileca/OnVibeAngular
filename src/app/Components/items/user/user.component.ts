import {Component, Input, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {User} from '../../../Data/Models/User/user';
import {ApiConfig} from '../../../Data/Constants/api';
import {UserService} from '../../../Data/Services/user.service';
import {FileService} from '../../../Data/Services/file.service';
import {PostService} from '../../../Data/Services/post.service';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {Assets} from '../../../Data/Constants/assets';

@Component({
  selector: 'app-user',
  imports: [
    RouterLink
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  @Input() public user!: User;
  public avatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService) {
  }

  async ngOnInit() {
    await this.loadAvatar()
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.user.id}/avatar`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly Assets = Assets;
}
