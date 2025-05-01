import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../Data/Services/user.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {User} from '../../../Data/Models/User/user';
import {ApiConfig} from '../../../Data/Constants/api';
import {FileService} from '../../../Data/Services/file.service';
import {Assets} from '../../../Data/Constants/assets';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {UpdateUser} from '../../../Data/Models/User/update-user';
import {DateHelper} from '../../../Helpers/date-helper';

@Component({
  selector: 'app-user-profile-edit',
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css'
})
export class UserProfileEditComponent implements OnInit {
  protected user!: User;
  protected avatarUrl: string | null = null;
  protected avatarPreview: string | null = null;
  protected isSubmitting: boolean = false;

  protected profileForm = new FormGroup({
    bio: new FormControl('', [Validators.maxLength(1000)]),
    city: new FormControl(''),
    country: new FormControl(''),
    dateOfBirth: new FormControl<string | null>(null),
    avatar: new FormControl<File | null>(null)
  });

  constructor(private readonly _userService: UserService,
              private readonly _fileService: FileService,
              private readonly _route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId = this._route.snapshot.params['userId'];

    this.loadUser(userId);
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileForm.patchValue({ avatar: input.files[0]});

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(<File>this.profileForm.get('avatar')!.value);
    }
  }

  protected removeAvatar(){
    if(this.avatarPreview){
      this.avatarPreview = null;
    }
    else{
      this.avatarUrl = null;
      this.profileForm.patchValue({ avatar: null })
    }
  }

  protected async onSubmit(){
    if(this.isSubmitting) return;

    this.isSubmitting = true;
    this.user = await this._userService.updateUser(this.user.id, <UpdateUser>this.profileForm.value);
    await this.updateForm();
    this.isSubmitting = false;
  }

  private async loadUser(userId: string) {
    this.user = await this._userService.getUserById(userId);
    await this.updateForm();
  }

  private async loadAvatar(){
    const url = `${ApiConfig.BaseUrl}/users/${this.user.id}/avatar`;
    this.avatarUrl = await this._fileService.loadImageAsDataUrl(url);
  }

  private async updateForm(){
    this.profileForm.reset({
      bio: this.user?.bio || '',
      country: this.user?.country || '',
      city: this.user?.city || '',
      dateOfBirth: DateHelper.formatForDateTimeLocal(new Date(this.user.dateOfBirth!))
    });
    await this.loadAvatar();
  }

  protected readonly Assets = Assets;
}
