import { Routes } from '@angular/router';
import {SignInComponent} from './Pages/sign-in/sign-in.component';
import {SignUpComponent} from './Pages/sign-up/sign-up.component';
import {ChatsComponent} from './Pages/chats/chats.component';
import {authGuard} from './Guards/auth.guard';

export const routes: Routes = [
  { path: "*", redirectTo: "chats" },
  { path: "sign-in", component: SignInComponent, canActivate: [] },
  { path: "sign-up", component: SignUpComponent, canActivate: [] },
  { path: "chats", component: ChatsComponent, canActivate: [authGuard] },
];
