import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import appConfig from 'src/app/config/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/solaire.png',
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      grant_type: 'authorization_code',
      authParams: {
        pkce: true,
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes
      }
    });

  }

  ngOnInit(): void {

    this.oktaSignin.remove();

    this.oktaSignin.renderEl(

      {el: '#okta-sign-in-widget'},

      (response: any) => {
        if ('SUCCESS' === response.status) {
          console.log("Success logging in");
          this.oktaAuth.signInWithRedirect();
        }
      },

      (error: any) => {
        console.log("failure logging in");
        throw error;
      }

    );
  }

}
