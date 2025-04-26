import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsersListComponent} from '../../pagination/users-list/users-list.component';
import {PageSettings} from '../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../Data/Models/Page/paged-response';
import {User} from '../../../Data/Models/User/user';
import {UserService} from '../../../Data/Services/user.service';
import {PaginationConfig} from '../../../Data/Constants/pagination-configs';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    UsersListComponent,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent{
  public form: FormGroup = new FormGroup({
    username: new FormControl(null, null),
    country: new FormControl(null, null),
    city: new FormControl(null, null)
  });

  protected usersSource: (pageSettings: PageSettings) => Promise<PagedResponse<User>>

  constructor(private readonly _userService: UserService) {
    this.usersSource = (pageSettings: PageSettings) =>
      this._userService.getUsers(this.form.value, pageSettings)
  }

  public onCriteriaChanged() {
    this.usersSource = (pageSettings: PageSettings) =>
      this._userService.getUsers(this.form.value, pageSettings)
  }

  protected readonly PaginationConfig = PaginationConfig;
}
