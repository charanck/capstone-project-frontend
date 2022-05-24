import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isAdmin = false;
  isFeedbackGiven = false;
  userId = '';

  constructor(private router: Router) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
  }

  ngOnInit(): void {
    const user = JSON.parse(String(localStorage.getItem('user')));
    this.isAdmin = user.role == 'admin';
    this.isFeedbackGiven = user.feedback != null ? true : false;
    this.userId = user.id;
  }
}
