import { Component } from '@angular/core';
import {PaginationBaseComponent} from '../pagination-base/pagination-base.component';
import {Post} from '../../../../Data/Models/Post/post';
import {AsyncPipe, NgForOf} from '@angular/common';
import {PostComponent} from '../../items/post/post.component';

@Component({
  selector: 'app-posts-list',
  imports: [
    NgForOf,
    PostComponent,
    AsyncPipe
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent extends PaginationBaseComponent<Post> {
  constructor() {
    super();
  }
}
