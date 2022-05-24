import { UserInterface } from 'src/app/interfaces/userInterface';
import { SetupWSService } from './../../services/setup-ws.service';
import { StateService } from './../../services/state.service';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users : UserInterface[] = [];
  constructor(private stateService: StateService, private router: Router,private setupWSService:SetupWSService) {}

  ngOnInit(): void {
    if (this.stateService.getToken() == '') {
      this.router.navigate(['login']);
      return;
    }
    this.setupWSService.setUpWs();
    this.stateService.getAllUsers().subscribe((users:any) =>{
      this.users = []; 
      const loggedInUser = JSON.parse(String(localStorage.getItem('user')));
      users.forEach((user:any) =>{
        if(loggedInUser.id !== user.id){
          this.users.push(user);
        }
      })
    });
  }
}
