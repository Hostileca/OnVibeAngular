import { Routes } from '@angular/router';
import {SignInComponent} from './Components/pages/sign-in/sign-in.component';
import {SignUpComponent} from './Components/pages/sign-up/sign-up.component';
import {ChatsComponent} from './Components/pages/chats/chats.component';
import {authGuard} from './Guards/auth.guard';
import {UserProfileComponent} from './Components/pages/user-profile/user-profile.component';
import {UsersComponent} from './Components/pages/users/users.component';
import {UserProfileEditComponent} from './Components/pages/user-profile-edit/user-profile-edit.component';
import {WallComponent} from './Components/pages/wall/wall.component';

export const routes: Routes = [
  { path: "wall", component: WallComponent, canActivate: [authGuard] },
  { path: "sign-in", component: SignInComponent, canActivate: [] },
  { path: "sign-up", component: SignUpComponent, canActivate: [] },
  { path: "chats", component: ChatsComponent, canActivate: [authGuard] },
  { path: "users", component: UsersComponent, canActivate: [authGuard] },
  { path: "users/:userId", component: UserProfileComponent, canActivate: [authGuard] },
  { path: "users/:userId/edit", component: UserProfileEditComponent, canActivate: [authGuard] },

  { path: "", redirectTo: "wall", pathMatch: "full" },
  { path: "**", redirectTo: "wall" }
];
