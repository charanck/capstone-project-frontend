import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SetupWSService } from 'src/app/services/setup-ws.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  loggedInUser : any = null;


  constructor(
    private route: ActivatedRoute,
    private setupWSService: SetupWSService,
    private stateService: StateService,
    private userService :UserService,
    private router: Router,
  ) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
  }

  ngOnInit(): void {
    let userId = String(this.route.snapshot.paramMap.get('userId'));
    this.setupWSService.setUpWs();
    this.stateService.getAllUsers().subscribe((users: any) => {
      users.forEach((user: any) => {
        if (user.id === userId) {
          this.currentUser = user;
        }
      });
      this.loggedInUser = JSON.parse(String(localStorage.getItem('user')));
    });
  }

  updateUser(){
    const statusElement:any = document.getElementById('status');
    this.currentUser.status = String(statusElement.value);
    this.userService.update(this.currentUser);
  }

  logout(){
    this.userService.logout();
  }
}
