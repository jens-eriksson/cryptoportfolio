import { Router } from '@angular/router';
import { AuthProvider } from './../../../auth/auth.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user;

  constructor(private router: Router, private auth: AuthProvider) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  signOut() {
    this.auth.logout().then(() => {
      location.reload();
    });
  }
}
