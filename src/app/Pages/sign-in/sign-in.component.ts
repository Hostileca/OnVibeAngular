import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  constructor(private readonly _router: Router,
              private readonly _authService: AuthService
  ){}

  public Form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(4)])
  });

  async onSubmit() {
    try {
      await this._authService.Login(this.Form.value)
    }
    catch(error){
      console.error(error);
    }
    finally {
      await this._router.navigateByUrl("/chats")
    }
  }
}
