import {Component, Input, OnInit} from '@angular/core';
import {Chat} from '../../../Data/Models/Chat/chat';
import {ModalBaseComponent} from '../modal-base/modal-base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ChatService} from '../../../Data/Services/chat.service';
import {User} from '../../../Data/Models/User/user';
import {AuthService} from '../../../Data/Services/auth.service';
import {SubscriptionService} from '../../../Data/Services/subscription.service';
import {NgForOf, NgIf} from '@angular/common';
import {ChatMemberService} from '../../../Data/Services/chat-member.service';
import {UpdateChat} from '../../../Data/Models/Chat/update-chat';
import {UserComponent} from '../../pagination/items/user/user.component';
import {ApiConfig} from '../../../Data/Constants/api';
import {FileService} from '../../../Data/Services/file.service';
import {UserService} from '../../../Data/Services/user.service';
import {Assets} from '../../../Data/Constants/assets';

@Component({
  selector: 'app-chat-info',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    UserComponent
  ],
  templateUrl: './chat-info-modal.component.html',
  styleUrl: './chat-info-modal.component.css'
})
export class ChatInfoModalComponent extends ModalBaseComponent implements OnInit {
  @Input({ required: true }) chat!: Chat;

  chatForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    image: new FormControl<File | null>(null),
  });

  isLoading = false;

  protected imageUrl: string | null = null;
  protected imagePreview: string | null = null;

  availableUsers: User[] = [];
  originalMembers: User[] = [];
  selectedMembers: User[] = [];

  constructor(private readonly _chatService: ChatService,
              private readonly _authService: AuthService,
              private readonly _userService: UserService,
              private readonly _subscriptionService: SubscriptionService,
              private readonly _chatMemberService: ChatMemberService,
              private readonly _fileService: FileService,
              activeModal: NgbActiveModal
  ) {
    super(activeModal);
  }

  async ngOnInit() {
    this.chatForm.patchValue({ name: this.chat.name });
    const url = `${ApiConfig.BaseUrl}/chats/${this.chat.id}/image`;
    this.imageUrl = await this._fileService.loadImageAsDataUrl(url);

    this.initUsers();
  }

  async initUsers(): Promise<void> {
    try {
      await this._authService.refreshCurrentUserInfo();
      const currentUser = this._authService.userInfo!;
      const [subscribers, subscriptions] = await Promise.all([
        this._subscriptionService.getSubscribers(currentUser.id, { pageNumber: 1, pageSize: currentUser.subscribersCount }),
        this._subscriptionService.getSubscriptions(currentUser.id, { pageNumber: 1, pageSize: currentUser.subscribersCount }),
      ]);

      const memberIds = this.chat.members.map(m => m.userId);
      this.originalMembers = await this._userService.getUsersByIds(memberIds);
      this.selectedMembers = [...this.originalMembers];

      const usersMap = new Map<string, User>();
      [...subscribers.items, ...subscriptions.items].forEach(sub => {
        const user = sub.user;
        if (!usersMap.has(user.id) && user.id !== currentUser.id) {
          usersMap.set(user.id, user);
        }
      });

      const memberIdsSet = new Set(memberIds)
      this.availableUsers = Array.from(usersMap.values()).filter(u => !memberIdsSet.has(u.id));
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.chatForm.patchValue({ image: input.files[0]});

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(<File>this.chatForm.get('image')!.value);
    }
  }

  removeImage(): void {
    if(this.imagePreview){
      this.imagePreview = null;
    }
    else{
      this.imageUrl = null;
      this.chatForm.patchValue({ image: null })
    }
  }

  moveToSelected(user: User): void {
    this.availableUsers = this.availableUsers.filter(u => u.id !== user.id);
    this.selectedMembers.push(user);
  }

  moveToAvailable(user: User): void {
    this.selectedMembers = this.selectedMembers.filter(u => u.id !== user.id);
    this.availableUsers.push(user);
  }

  async onSubmit(): Promise<void> {
    if (this.chatForm.invalid || this.isLoading) return;

    this.isLoading = true;

    try {
      await this._chatService.updateChat(this.chat.id, <UpdateChat>this.chatForm.value);

      const originalIds = new Set(this.originalMembers.map(u => u.id));
      const selectedIds = new Set(this.selectedMembers.map(u => u.id));

      const toAdd = this.selectedMembers.filter(u => !originalIds.has(u.id));
      const toRemove = this.originalMembers.filter(u => !selectedIds.has(u.id));

      await Promise.all([
        ...toAdd.map(u => this._chatMemberService.addMemberToChat(this.chat.id, u.id)),
        ...toRemove.map(u => this._chatMemberService.removeMemberFromChat(this.chat.id, u.id)),
      ]);

      this.close();
    } catch (error) {
      console.error('Failed to update chat:', error);
    } finally {
      this.isLoading = false;
    }
  }

  protected readonly Assets = Assets;
}
