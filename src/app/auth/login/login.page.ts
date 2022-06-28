import { Router } from '@angular/router';
import { AuthProvider } from '../auth.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  message: string;

  constructor(
    private auth: AuthProvider,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.email, this.password)
    .then(() => {
      this.email = null;
      this.password = null;
      this.message = null;
      this.router.navigateByUrl('/');
    })
    .catch(err => {
      this.message = 'Sign in failed';
    });
  }
}
