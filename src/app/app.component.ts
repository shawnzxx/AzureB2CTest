import { Component, OnInit } from '@angular/core';
import * as Msal from 'msal';
import { Configuration, UserAgentApplication, AuthenticationParameters } from 'msal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  private readonly applicationId = "264e71ab-8150-486f-b40b-8cd05ba31048"; // B2C application Id
  private readonly tenant = "merlionb2c.onmicrosoft.com"; // Azure tenant ID
  private readonly signUpSignInPolicy = "B2C_1_signupsignin"; // Name of user flow
  private readonly instance = "https://login.microsoftonline.com/tfp/";
  // name of scope, taken from the portal
  private readonly b2cScopes = ["https://merlionb2c.onmicrosoft.com/api/user_impersonation"];
  myMSALObj: UserAgentApplication;

  config: Configuration = {
    auth: {
      clientId: this.applicationId,
      authority: this.instance + this.tenant + "/" + this.signUpSignInPolicy,
      redirectUri: window.location.href,
      postLogoutRedirectUri: window.location.href
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  }
  loginRequest: AuthenticationParameters = {
    scopes: this.b2cScopes
  }

  // create callback for redirect function
  authCallBack(error, response): void {
    // handle error or response
    console.log(response);
  }

  ngOnInit(): void {
    // create UserAgentApplication instance
    this.myMSALObj = new Msal.UserAgentApplication(this.config) as UserAgentApplication;
    this.myMSALObj.handleRedirectCallback(this.authCallBack)
  }

  login(): void {
    var _this = this; // JS this :(
    this.myMSALObj.loginPopup(this.loginRequest).then(function (loginResponse) {
      console.log(loginResponse);
      let account = _this.myMSALObj.getAccount();
      if (account) {
        // signin successful
        console.log("User:\n");
        console.log(account);
      } else {
        // signin failure
        console.log("Sign in failed, no user info");
      }
      return _this.myMSALObj.acquireTokenSilent(_this.loginRequest);
    }).then(function (accessTokenResponse) {
      const token = accessTokenResponse.accessToken;
      console.log("JWT Token:\n" + token);
    }).catch(function (error) {
      //handle error
      console.log("error: ", error);
    });
  }
}
