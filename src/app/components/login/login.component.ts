import { WebsocketService } from './../../services/websocket.service';
import { StateService } from './../../services/state.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private userService: UserService,
    private stateService: StateService,
    private router:Router
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.userService
      .login(this.username, this.password, this.rememberMe)
      .subscribe((data: any) => {
        this.stateService.setUser({
          username: data.user.username,
          email: data.user.email,
          feedback: data.user.feedback,
          gender: data.user.gender,
          role: data.user.role,
          status: data.user.status,
          id: data.user._id,
          lastSeen:data.user.lastSeen,
          isActive:data.user.isActive
        });
        this.stateService.setToken(data.token);
        this.stateService.setAlertMessage("user loggedin successfully");
        this.router.navigate(['home']);
      });
  }
}
