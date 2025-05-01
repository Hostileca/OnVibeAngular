import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, BaseRouteReuseStrategy, Router, RouteReuseStrategy, RouterLink} from '@angular/router';
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
import {PostsListComponent} from '../../pagination/lists/posts-list/posts-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {AuthService} from '../../../Data/Services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePostModalComponent} from '../../modals/create-post/create-post-modal.component';
import {SubscriptionService} from '../../../Data/Services/subscription.service';
import {SubscriptionsInfoComponent} from '../../modals/subscriptions-info/subscriptions-info.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgIf,
    DatePipe,
    AgePipe,
    PostsListComponent,
    RouterLink
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  @ViewChild(PostsListComponent) postsListComponent!: PostsListComponent;

  public user!: User;
  public avatarUrl: string | null = null;
  public postsSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Post>>

  public get loadedPosts(){
    if(this.postsListComponent){
      return this.postsListComponent.entities;
    }
    return [];
  }

  protected get isCurrentUser(){
    return this._authService.userInfo?.id == this.user.id
  }

  constructor(private readonly _authService: AuthService,
              private readonly _userService: UserService,
              private readonly _fileService: FileService,
              private readonly _postService: PostService,
              private readonly _subscriptionService: SubscriptionService,
              private readonly _modalService: NgbModal,
              private readonly _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const userId = this._route.snapshot.params['userId'];

    this.loadUser(userId)

    this._route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      this.loadUser(userId!);
    });
  }

  protected openCreatePostModal(){
    this._modalService.open(CreatePostModalComponent, {
      size: 'lg',
      centered: true
    });
  }

  protected async toggleSubscription() {
    const subscription = await this._subscriptionService.upsertSubscription(this.user.id);
    this.user.isSubscribed = subscription.isSubscribed;
    if(subscription.isSubscribed){
      this.user.subscribersCount++;
    }
    else{
      this.user.subscribersCount--;
    }
  }

  protected async openSubscribersList() {
    const modalRef = this._modalService.open(SubscriptionsInfoComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.subscriptionsSource = (pageSettings: PageSettings) => this._subscriptionService.getSubscribers(this.user.id, pageSettings);
    modalRef.componentInstance.title = "Subscribers";
  }

  protected async openSubscriptionsList() {
    const modalRef = this._modalService.open(SubscriptionsInfoComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.subscriptionsSource = (pageSettings: PageSettings) => this._subscriptionService.getSubscriptions(this.user.id, pageSettings);
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.user.id}/avatar`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url);
  }

  private async loadUser(userId: string) {
    this.user = await this._userService.getUserById(userId);
    this.postsSource = (pageSettings: PageSettings) =>
      this._postService.getUserPosts(this.user.id, pageSettings)
    this.loadAvatar()
  }

  protected readonly Assets = Assets;
  protected readonly PaginationConfig = PaginationConfig;
}
