import {Component} from '@angular/core';
import {ModalBaseComponent} from '../modal-base/modal-base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../Data/Services/notification.service';
import {Notification} from '../../../Data/Models/Notifications/notification';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NotificationType} from '../../../Data/Models/Notifications/notification-type';

@Component({
  selector: 'app-notifications-list-modal',
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './notifications-list-modal.component.html',
  styleUrl: './notifications-list-modal.component.css'
})
export class NotificationsListModalComponent extends ModalBaseComponent{
  public notifications: Notification[] = [];

  constructor(private readonly _notificationService: NotificationService,
              _activeModal: NgbActiveModal) {
    super(_activeModal);
    this.loadNotifications()
  }

  private async loadNotifications(){
    this.notifications = await this._notificationService.getNotifications(false);
  }

  protected readonly NotificationType = NotificationType;
}
