import { StateService } from './../../services/state.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  username: string = '';
  password: string = '';
  email: string = '';
  role: string = '';
  gender: string = '';
  confirmPassword: string = '';

  constructor(private userservice: UserService,private stateService : StateService,private router: Router) {}
  ngOnInit(): void {}

  signup(): void {
    if (
      this.username != '' &&
      this.email != '' &&
      this.role != '' &&
      this.gender != '' &&
      this.password != '' &&
      this.confirmPassword != '' &&
      this.password === this.confirmPassword
    ) {
      this.userservice
        .signUp(
          this.username,
          this.email,
          this.gender,
          this.password,
          this.role
        )
        .subscribe({
          next: (data) => {
            this.stateService.setAlertMessage("user account created successfully");
            this.router.navigate(['login']);
          },
          error: (error) => {
            this.stateService.setAlertMessage(error.error.message);
          },
        });
    }else{
      this.stateService.setAlertMessage("all fields must be filled")
    }
  }
}
