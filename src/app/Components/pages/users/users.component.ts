import {Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import {PaginationBaseComponent} from '../../pagination/pagination-base-component/pagination-base.component';
import {User} from '../../../Data/Models/User/user';
import {NgForOf, NgIf} from '@angular/common';
import {UserComponent} from '../../items/user/user.component';
import {PostsListComponent} from '../../pagination/posts-list/posts-list.component';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    UserComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent extends PaginationBaseComponent<User> {
  public searchQuery = '';
  public searchQueryChanged = new Subject<string>();

  constructor() {
    super();
    this._loadingContainerId = 'users-container'
  }

  onSearchChange(): void {
    this.searchQueryChanged.next(this.searchQuery.trim());
  }
}
