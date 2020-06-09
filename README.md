# Nobackchat
Simple REST API Backend for chat application built with MongoDB and Node.js. Feel free to use it for your front-end chat application/

## To use
1. Install node and npm.
2. Clone / Fork this project and install dependencies via command ```npm install```

# End points
Let us define url for this.

```const URL = 'http://localhost:3000/' || process.env.URL```

## Signup: POST
POST url: `/api/auth/signup`

body: 
```
{
    email: "<EMAIL>"            // type: String, required
    username: "<USERNAME>",     // type: String, required
    password: "<PASSWORD>",     // type: String, required,
    extra: {                    // type: Object, optional
        anything: "<ANYTHING>"
    }
}
```
OnSuccess: Response.status will be 200(OK)
OnFail: Response.status will be an error code. Reason will be shown if possible to detect.