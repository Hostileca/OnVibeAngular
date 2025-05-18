import {Component, ViewChild} from '@angular/core';
import {PostsListComponent} from '../../pagination/lists/posts-list/posts-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {PostService} from '../../../Data/Services/post.service';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {Post} from '../../../Data/Models/Post/post';
import {AsyncPipe, NgIf} from '@angular/common';
import {of} from 'rxjs';

@Component({
  selector: 'app-wall',
  imports: [
    PostsListComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.css'
})
export class WallComponent {
  @ViewChild(PostsListComponent) postsListComponent!: PostsListComponent;

  public postsSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Post>>

  public get loadedPosts() {
    return this.postsListComponent?.entities$ ?? of([]);
  }

  constructor(private readonly _postService: PostService) {
    this.postsSource = (pageSettings: PageSettings) => this._postService.getWall(pageSettings)
  }

  protected readonly PaginationConfig = PaginationConfig;
}
