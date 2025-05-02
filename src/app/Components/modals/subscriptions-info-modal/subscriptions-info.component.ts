import {Component} from '@angular/core';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {SubscriptionsListComponent} from '../../pagination/lists/subscriptions-list/subscriptions-list.component';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';
import {Subscription} from '../../../Data/Models/Subscription/subscription';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalBaseComponent} from '../modal-base/modal-base.component';

@Component({
  selector: 'app-subscriptions-info',
  imports: [
    SubscriptionsListComponent
  ],
  templateUrl: './subscriptions-info.component.html',
  styleUrl: './subscriptions-info.component.css'
})
export class SubscriptionsInfoComponent extends ModalBaseComponent {
  public title: string = 'Subscriptions';
  public subscriptionsSource!: (pageSettings: PageSettings) => Promise<PagedResponse<Subscription>>

  constructor(activeModal: NgbActiveModal) {
    super(activeModal);
  }

  protected readonly PaginationConfig = PaginationConfig;
}
