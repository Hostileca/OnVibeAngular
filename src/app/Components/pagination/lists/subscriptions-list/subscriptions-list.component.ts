import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {PostComponent} from "../../items/post/post.component";
import {UserComponent} from '../../items/user/user.component';
import {PaginationBaseComponent} from '../pagination-base/pagination-base.component';
import {Subscription} from '../../../../Data/Models/Subscription/subscription';

@Component({
  selector: 'app-subscriptions-list',
  imports: [
    NgForOf,
    UserComponent
  ],
  templateUrl: './subscriptions-list.component.html',
  styleUrl: './subscriptions-list.component.css'
})
export class SubscriptionsListComponent extends PaginationBaseComponent<Subscription>{
    constructor() {
      super();
      this._loadingContainerId = "subscriptions-list";
    }
}
