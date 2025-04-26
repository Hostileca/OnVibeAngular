import { Component } from '@angular/core';
import {PaginationBaseComponent} from '../pagination-base-component/pagination-base.component';
import {User} from '../../../Data/Models/User/user';
import {NgForOf, NgIf} from '@angular/common';
import {UserComponent} from '../../items/user/user.component';

@Component({
  selector: 'app-users-list',
  imports: [
    NgIf,
    UserComponent,
    NgForOf
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent extends PaginationBaseComponent<User> {
  constructor() {
    super();
    this._loadingContainerId = 'users-container'
  }
}
