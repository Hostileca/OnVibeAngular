import { Component } from '@angular/core';
import {AuthService} from '../../../Data/Services/auth.service';
import {User} from '../../../Data/Models/User/user';
import {NgIf} from '@angular/common';
import {RouterLink, RouterModule} from '@angular/router';
import {SubscriptionsInfoComponent} from '../../modals/subscriptions-info-modal/subscriptions-info.component';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  NotificationsListModalComponent
} from '../../modals/notifications-list-modal/notifications-list-modal.component';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    RouterLink,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public user!: User;
  constructor(private readonly _authService: AuthService,
              private readonly _modalService: NgbModal ) {
    this.user = _authService.userInfo!;
  }

  public openNotifications() {
    const modalRef = this._modalService.open(NotificationsListModalComponent, {
      size: 'lg',
      centered: true
    });
  }
}
