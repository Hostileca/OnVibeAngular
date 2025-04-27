import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../../Data/Models/User/user';
import {UserService} from '../../../Data/Services/user.service';
import {DatePipe, NgIf} from '@angular/common';
import {ApiConfig} from '../../../Data/Constants/api';
import {FileService} from '../../../Data/Services/file.service';
import {AgePipe} from '../../../Data/Pipes/age.pipe';
import {Assets} from '../../../Data/Constants/assets';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {Post} from '../../../Data/Models/Post/post';
import {PostService} from '../../../Data/Services/post.service';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {PostsListComponent} from '../../pagination/posts-list/posts-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {AuthService} from '../../../Data/Services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePostModalComponent} from '../../modals/create-post/create-post-modal.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgIf,
    DatePipe,
    AgePipe,
    PostsListComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @ViewChild(PostsListComponent) postsListComponent!: PostsListComponent;

  public user!: User;
  public avatarUrl: string | null = null;
  public postsSource: (pageSettings: PageSettings) => Promise<PagedResponse<Post>>

  public get loadedPosts(){
    if(this.postsListComponent){
      return this.postsListComponent.entities;
    }
    return [];
  }

  constructor(private readonly _authService: AuthService,
              private readonly _userService: UserService,
              private readonly _fileService: FileService,
              private readonly _postService: PostService,
              private readonly modalService: NgbModal,
              route: ActivatedRoute) {
    const userId = route.snapshot.params['userId'];

    this.postsSource = (pageSettings: PageSettings) =>
      this._postService.getUserPosts(this.user.id, pageSettings)

    this.loadUser(userId)
  }

  private async loadUser(userId: string) {
    this.user = await this._userService.getUserById(userId);
    this.loadAvatar()
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.user.id}/avatar`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url)
  }

  protected get isCurrentUser(){
    return this._authService.userInfo?.id == this.user.id
  }

  protected openCreatePostModal(){
    const modalRef = this.modalService.open(CreatePostModalComponent, {
      size: 'lg',
      centered: true
    });
  }

  protected readonly Assets = Assets;
  protected readonly PaginationConfig = PaginationConfig;
}
