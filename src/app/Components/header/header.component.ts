import { Component } from '@angular/core';
import {AuthService} from '../../Data/Services/auth.service';
import {User} from '../../Data/Models/User/user';
import {NgIf} from '@angular/common';
import {RouterLink, RouterModule} from '@angular/router';

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
  constructor(private readonly _authService: AuthService) {
    this.user = _authService.userInfo!;
  }
}
