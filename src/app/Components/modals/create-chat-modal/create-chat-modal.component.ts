import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ChatService } from '../../../Data/Services/chat.service';
import { SubscriptionService } from '../../../Data/Services/subscription.service';
import { User } from '../../../Data/Models/User/user';
import { AuthService } from '../../../Data/Services/auth.service';
import {CreateChat} from '../../../Data/Models/Chat/create-chat';
import {NgForOf, NgIf} from '@angular/common';
import {UserComponent} from '../../pagination/items/user/user.component';
import {ModalBaseComponent} from '../modal-base/modal-base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat-modal.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    UserComponent
  ],
  styleUrls: ['./create-chat-modal.component.css']
})
export class CreateChatComponent extends ModalBaseComponent implements OnInit {
  protected availableUsers: User[] = [];
  protected isLoading = false;

  protected chatForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    userIds: new FormControl<string[]>([], [Validators.required]),
    image: new FormControl<File | null>(null)
  });

  constructor(private readonly _chatService: ChatService,
              private readonly _subscriptionService: SubscriptionService,
              private readonly _authService: AuthService,
              activeModal: NgbActiveModal) {
    super(activeModal);
  }

  ngOnInit(): void {
    this.loadAvailableUsers();
  }

  private async loadAvailableUsers() {
    const currentUser = this._authService.userInfo!;
    const [subscribers, subscriptions] = await Promise.all([
      this._subscriptionService.getSubscribers(currentUser.id, { pageNumber: 1, pageSize: currentUser.subscribersCount }),
      this._subscriptionService.getSubscriptions(currentUser.id, { pageNumber: 1, pageSize: currentUser.subscriptionsCount })
    ]);

    const usersMap = new Map<string, User>();
    [...subscribers.items, ...subscriptions.items].forEach(sub => {
      if (!usersMap.has(sub.user.id) && sub.user.id !== currentUser.id) {
        usersMap.set(sub.user.id, sub.user);
      }
    });

    this.availableUsers = Array.from(usersMap.values());
  }

  toggleUserSelection(userId: string) {
    const currentIds = this.chatForm.controls.userIds.value || [];
    const newIds = currentIds.includes(userId)
      ? currentIds.filter(id => id !== userId)
      : [...currentIds, userId];

    this.chatForm.controls.userIds.setValue(newIds);
    this.chatForm.controls.userIds.markAsDirty();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.chatForm.controls.image.setValue(input.files[0]);
    }
  }

  async onSubmit() {
    if (this.chatForm.invalid || this.isLoading) return;

    this.isLoading = true;
    await this._chatService.createChat(<CreateChat>this.chatForm.value);
    this.isLoading = false;
    this.close();
  }
}
