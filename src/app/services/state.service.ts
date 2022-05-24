import { SetupWSService } from './setup-ws.service';
import { MessageAndAttachmentService } from './message-and-attachment.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserInterface } from './../interfaces/userInterface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private serverURI: string = 'http://localhost:3000';
  private socketURI: string = 'ws://localhost:3000';

  private token: string = '';
  private user: UserInterface | null;

  private _alertMessage = new Subject<string>();
  alertMessage = this._alertMessage.asObservable();

  private _allUsers = new Subject<UserInterface[]>();
  private allUsers = this._allUsers.asObservable();

  constructor(private http: HttpClient,private setUpWsService :SetupWSService) {
    if (localStorage.getItem('token')) {
      this.setToken(String(localStorage.getItem('token')));
    } else {
      this.token = '';
    }
    this.user = null;
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    let users: UserInterface[] = [];

    this._getAllUsers().subscribe((data: any) => {
      data.forEach((user: any) => {
        users.push({
          username: user.username,
          email: user.email,
          gender: user.gender,
          role: user.role,
          status: user.status,
          id: user._id,
          feedback: user.feedback?._id,
          lastSeen: new Date(user.lastSeen),
          isActive: user.isActive,
        });
      });
      this._allUsers.next(users);   
    });
    localStorage.setItem("token",this.getToken());
      this.setUpWsService.setUpWs();
  }

  setUser(user: UserInterface) {
    localStorage.removeItem("user");
    localStorage.setItem('user',JSON.stringify(user));
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  getServerURI() {
    return this.serverURI;
  }

  getSocketURI() {
    return this.socketURI;
  }

  getAlertMessage() {
    return this.alertMessage;
  }

  setAlertMessage(alertMessage: string) {
    this._alertMessage.next(alertMessage);
  }

  _getAllUsers() {
    return this.http.get(`${this.getServerURI()}/users`, {
      headers: {
        token: this.getToken(),
      },
    });
  }

  getAllUsers(){
    this._getAllUsers().subscribe((data: any) => {
      let users:UserInterface[] = [];
      data.forEach((user: any) => {
        users.push({
          username: user.username,
          email: user.email,
          gender: user.gender,
          role: user.role,
          status: user.status,
          id: user._id,
          feedback: user.feedback,
          lastSeen: new Date(user.lastSeen),
          isActive: user.isActive,
        });
      });
      this._allUsers.next(users);   
    });
    return this.allUsers;
  }

  
}
