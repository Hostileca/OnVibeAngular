import { Component } from '@angular/core';
import {PostsListComponent} from '../../pagination/lists/posts-list/posts-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {PostService} from '../../../Data/Services/post.service';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {Post} from '../../../Data/Models/Post/post';

@Component({
  selector: 'app-wall',
  imports: [
    PostsListComponent
  ],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.css'
})
export class WallComponent {
  public postsSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Post>>

  constructor(private readonly _postService: PostService) {
    this.postsSource = (pageSettings: PageSettings) => this._postService.getWall(pageSettings)
  }

  protected readonly PaginationConfig = PaginationConfig;
}
