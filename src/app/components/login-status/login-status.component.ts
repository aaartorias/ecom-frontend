import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})

export class LoginStatusComponent implements OnInit {
  
  isUserAuthenticated: boolean = false;
  userFullName: string = '';
  storage: Storage = sessionStorage;
  emailKey: string = 'userEmail';

  constructor(private oktaAuthStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  ngOnInit(): void {

    this.oktaAuthStateService.authState$.subscribe(
      (result) => {
        this.isUserAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isUserAuthenticated) {
      this.oktaAuth.getUser().then(
        (response) => {
          this.userFullName = response.name as string;
          const email = response.email;
          this.storage.setItem(this.emailKey, JSON.stringify(email));
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }

}


