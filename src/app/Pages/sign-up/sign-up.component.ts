import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../Data/Services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  constructor(private readonly _router: Router,
              private readonly _authService: AuthService
  ){}

  public form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(4)])
  });

  async onSubmit() {
    try {
      await this._authService.register(this.form.value)
    }
    catch(error){
      console.error(error);
    }
    finally {
      await this._router.navigateByUrl("/chats")
    }
  }
}
