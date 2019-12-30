# loopback-project-authentication

A tutorial for setting up a basic configuration :
- for [passport-otp](https://github.com/yash17525/passport-otp.git) module which login a user using OTP method
- for passport-local
- for third party login provider (facebook, google, twitter etc.) 

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Client ids/secrets from third party](#client-idssecrets-from-third-party)
- [Tutorial - Facebook](#tutorial---facebook)
- [Tutorial - passport-otp](#tutorial---passport-otp)

## Overview

LoopBack example for [loopback-passport](https://github.com/yash17525/loopback-project-authentication.git) module. It demonstrates how to use
LoopBack's user/userIdentity/userCredential models and [passport](http://passportjs.org) to interact with other auth providers.

- Log in or sign up to LoopBack using third party providers (aka social logins)
- Link third party accounts with a LoopBack user (for example, a LoopBack user can have associated facebook/google accounts to retrieve pictures).
- Log in to Loopback using OTP(one time password) method provided by [passport-otp](https://github.com/yash17525/passport-otp.git) module.

## Prerequisites

Before starting this tutorial, make sure you have the following installed:

- Node
- NPM
- [StrongLoop Controller](https://github.com/strongloop/strongloop)
- Postman (API testing tool)

## Client ids/secrets from third party

- [facebook](https://developers.facebook.com/apps)
- [google](https://console.developers.google.com/project)
- [twitter](https://apps.twitter.com/)
- Keys from the message provdier. For eg, [Twilio](https://www.twilio.com/authy/features/otp)


## Tutorial - [passport-otp](https://github.com/yash17525/passport-otp.git)

### 1. Clone the application

```
$ git clone https://github.com/yash17525/loopback-project-authentication.git
$ cd loopback-project-authentication
$ npm install
```

### 2. Get your keys(Auth Token, Account SID) from the twilio or any other service provider for sending messages.

- Visit your twilio account
- In the dashboard, you will see your Account SID and Auth Token

### 3. Create providers.json

- Copy providers.json.template to providers.json
- Update providers.json with your own values for `clientID/clientSecret` for third party login providers if any.
- There is no need to change configuration for passport-otp.

  ```
   },
  "otp": {
    "authScheme": "otp",
    "provider":"passport-otp",
    "module": "passport-otp",
    "countryCodeField": "+91",
    "authPath": "/auth/otp",
    "callbackPath": "/auth/verify",
    "successRedirect": "/auth/account",
    "failureRedirect": "/otp",
    "failureFlash": true,
    "callbackHTTPMethod": "post",
    "modelToSaveGeneratdKeys": "otpSecret"
  }
}
  ```
  ```

### 4. Create .env 
Copy .env_sample to .env and replace dummy variables with your Auth Token and Account SID.

### 5. Data file

- If you need to see your account info for testing purposes, in `server\datasources.json`, add:

```
"file":"db.json"
```

after

```
"connector": "memory",

```
or after 

```
"connector" : "mongodb"

```

- The account info will be saved into this file.

### 6. Run the application

```
$ node .
```
- Open Postman(API Testing Tool) to check the api end points for /auth/otp and /auth/verify
- Make a GET request by replacing countryCode ,YourMobileNumber with your own country code and mobile number : http://127.0.0.1:3000/auth/otp?countryCode=%2BcountryCode&mobile=YourMobileNumber
 ![image](https://user-images.githubusercontent.com/33418013/71595155-88c9c200-2b60-11ea-9e6f-0be9a94b04bd.png)

- After receiving the OTP on mobile, make a POST request as such : http://127.0.0.1:3000/auth/verify  and supply the countryCode, mobile, OTP by the request body as a JSON Object,like this ;
- {	"countryCode":"+91",
	"mobile":"82198404086"
	"token":"348790"}
  ![image](https://user-images.githubusercontent.com/33418013/71594966-e14c8f80-2b5f-11ea-8b8c-9e09f6486800.png)
- If OTP is valid you will be logged in as a user.

## Tutorial - Facebook

### 1. Clone the application

```
$ git clone https://github.com/yash17525/loopback-project-authentication.git
$ cd loopback-project-authentication
$ npm install
```

### 2. Get your client ids/secrets from third party(social logins)

- To get your app info: [facebook](https://developers.facebook.com/apps)
- Click on My Apps, then on Add a new App
- Pick the platform [iOS, Android, Facebook Canvas, Website]
- Select proper category for your app.
- Write your app name and "Site URL".
- Skip the quick start to get your "App ID" and "App Secret", which is in "Settings"
- Your app may not work if the settings are missing a contact email and/or "Site URL".
- if you are testing locally, you can simply use `localhost:[port#]` as your "Site URL".

### 3. Create providers.json

- Copy providers.json.template to providers.json
- Update providers.json with your own values for `clientID/clientSecret`.

  ```
  "facebook-login": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": "xxxxxxxxxxxxxxx",
    "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "callbackURL": "/auth/facebook/callback",
    "authPath": "/auth/facebook",
    "callbackPath": "/auth/facebook/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": ["email"],
    "failureFlash": true
  },
  "facebook-link": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": "xxxxxxxxxxxxxxx",
    "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "callbackURL": "/link/facebook/callback",
    "authPath": "/link/facebook",
    "callbackPath": "/link/facebook/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": ["email", "user_likes"],
    "link": true,
    "failureFlash": true
  }
  ```

### 4. Facebook profile info

In a recent update, Facebook no longer returns all fields by default (email, gender, timezone, etc).
If you need more information, modify the providers template.

The current template contains:
```
"profileFields": ["gender", "link", "locale", "name", "timezone", "verified", "email", "updated_time"],

```
We recommend modifying the fields to suit your needs. For more information regarding the providers template, see http://loopback.io/doc/en/lb2/Configuring-providers.json.html.

### 5. Data file

- If you need to see your account info for testing purposes, in `server\datasources.json`, add:

```
"file":"db.json"
```

after

```
"connector": "memory",
```

- The account info will be saved into this file.

### 6. Run the application

```
$ node .
```

- Open your browser to `http://localhost:3000`
- Click on 'Log in' (in the header, on the rigth)
- Click on 'Login with Facebook'.
- Sign up using a local account, then link to your Facebook account.

