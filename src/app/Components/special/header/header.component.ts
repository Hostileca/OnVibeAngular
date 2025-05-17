import { Component } from '@angular/core';
import {AuthService} from '../../../Data/Services/auth.service';
import {NgIf} from '@angular/common';
import {RouterLink, RouterModule} from '@angular/router';
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
  constructor(private readonly _authService: AuthService,
              private readonly _modalService: NgbModal) {
  }

  public get isLoggedIn() {
    return this._authService.isAuth;
  }

  public get user() {
    return this._authService.userInfo
  }

  public openNotifications() {
    this._modalService.open(NotificationsListModalComponent, {
      size: 'lg',
      centered: true
    });
  }

  public logout() {
    this._authService.logout();
  }
}
