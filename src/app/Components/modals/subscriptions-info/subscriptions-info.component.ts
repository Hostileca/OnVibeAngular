import {Component} from '@angular/core';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {SubscriptionsListComponent} from '../../pagination/lists/subscriptions-list/subscriptions-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {Subscription} from '../../../Data/Models/Subscription/subscription';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subscriptions-info',
  imports: [
    SubscriptionsListComponent
  ],
  templateUrl: './subscriptions-info.component.html',
  styleUrl: './subscriptions-info.component.css'
})
export class SubscriptionsInfoComponent {
  public title: string = 'Subscriptions';
  public subscriptionsSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Subscription>>

  constructor(private readonly _activeModal: NgbActiveModal) {
  }

  public close() {
    this._activeModal.close();
  }

  protected readonly PaginationConfig = PaginationConfig;
}
