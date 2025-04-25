import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../Data/Models/User/user';
import {UserService} from '../../Data/Services/user.service';
import {DatePipe, NgIf} from '@angular/common';
import {ApiConfig} from '../../Data/Constants/api';
import {FilesService} from '../../Data/Services/files.service';
import {AgePipe} from '../../Data/Pipes/age.pipe';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgIf,
    DatePipe,
    AgePipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  public user!: User;
  public avatarUrl: string | null = null;

  constructor(private readonly _route: ActivatedRoute,
              private readonly _userService: UserService,
              private readonly _filesService: FilesService) {
    const userId = _route.snapshot.params['userId'];

    this.loadUser(userId)
  }

  private async loadUser(userId: string) {
    this.user = await this._userService.getUserById(userId);
    this.loadAvatar()
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.user.id}/avatar`;
    this.avatarUrl = await this._filesService.loadImageAsDataUrl(url)
  }
}
