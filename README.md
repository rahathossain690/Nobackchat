# Nobackchat
Simple REST API Backend for chat application built with MongoDB and Node.js. Feel free to use it for your front-end chat application/

## To use
1. Install node and npm.
2. Clone / Fork this project and install dependencies via command ```npm install```

# End points
Let us define url for this.

```const URL = 'http://localhost:3000/' || process.env.URL```

## Sign-up: POST
```
var body = {
    email: "rahathossain690@gmail.com"      // String, required
    username: "Rahat Hossain",              // String, required
    password: "ThIsiSverystrongpassword69", //String, required,
    extra: {                                // Object, not required
        gender: "Male"
    }
}
```

