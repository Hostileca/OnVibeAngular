import { Component } from '@angular/core';
import {PaginationBaseComponent} from '../pagination-base/pagination-base.component';
import {Post} from '../../../../Data/Models/Post/post';
import {NgForOf} from '@angular/common';
import {MessageComponent} from '../../items/message/message.component';
import {PostComponent} from '../../items/post/post.component';

@Component({
  selector: 'app-posts-list',
  imports: [
    NgForOf,
    PostComponent
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent extends PaginationBaseComponent<Post> {
  constructor() {
    super();
    this._loadingContainerId = 'posts-container'
  }
}
