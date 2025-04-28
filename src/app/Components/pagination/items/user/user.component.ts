import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {User} from '../../../../Data/Models/User/user';
import {ApiConfig} from '../../../../Data/Constants/api';
import {FileService} from '../../../../Data/Services/file.service';
import {Assets} from '../../../../Data/Constants/assets';
import {ItemBaseComponent} from '../item-base/item-base.component';

@Component({
  selector: 'app-user',
  imports: [
    RouterLink
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent extends ItemBaseComponent<User> implements OnInit {
  public avatarUrl: string | null = null;

  constructor(private readonly _fileService: FileService) {
    super();
  }

  async ngOnInit() {
    await this.loadAvatar()
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.item.id}/avatar`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected readonly Assets = Assets;
}
