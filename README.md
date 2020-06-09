# Nobackchat
Simple REST API Backend for chat application built with MongoDB and Node.js. Feel free to use it for your front-end chat application/

## To use
1. Install node and npm.
2. Clone / Fork this project and install dependencies via command ```npm install```
3. To enble email verification please go through necessery processes. 
4. Setup .env file with currect varriables.

# End points
Let us define url for this.

```const URL = 'http://localhost:3000/' || process.env.URL```

## Signup: POST
url: `/api/auth/signup`

body: 
```
{
    email: "<EMAIL>",           // type: String, required
    username: "<USERNAME>",     // type: String, required
    password: "<PASSWORD>",     // type: String, required
    extra: {                    // type: Object, optional
        anything: "<ANYTHING>"
    }
}
```
Requirement: User should not be logged in already.

OnSuccess: Response.status will be 200(OK). Verification email will be sent to the corresponding email address.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Signin: POST
url: `/api/auth/signin`

body:
```
{
    email: "<EMAIL>",           // type: String, required
    password: "<PASSWORD>"      // type: String, required
}
```

Requirement: User should not be logged in already.

OnSuccess: Response.status will be 200(OK). Verification email will be sent to the corresponding email address.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Signout: GET
url: `/api/auth/signout`

This GET request knows no failure ... only if your internet connection is failure itself.


