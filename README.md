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

## User: GET
url: `/api/secure/user`(for own information) or `/api/secure/user?userid={<USER_ID>}`(for information of <USER_ID>)

Requirements: User authentication and validation.

OnSuccess: Returns User with 200 status code

User:
```
{
    username: <USER_NAME>,
    email: <EMAIL>,
    extra: <EXTRA>,
    userid: <USER_ID>
}
```

OnFail: Returns error code.

## Create_chat: POST
url: `/api/secure/create_chat`

body:
```
{
    member: <USER_ID> // type: String, required
}
```
Requirement: User authentication and validation.

OnSuccess: Response.status will be 200(OK). If already chat existed then chat it will be returned. Else will be created anyway.

Returned Chat Schema:
```
{
    name: "<CHAT_NAME>",
    chatid: "<CHAT_ID>",
    member: ["USER_ID", ...],
    seen: ["USER_ID", ...],
    isGroup: false,
    lastUpdate: <DATE>
}
```

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Create_group: POST
url: `/api/secure/create_group`

body:
```
{
    members: ["USER_ID", ...] // type: Array of String, required
}
```
Requirement: User authentication and validation.

OnSuccess: Response.status will be 200(ok). Chat will be returned.

Returned Chat
```
{
    name: "<CHAT_NAME>",
    chatid: "<CHAT_ID>",
    member: ["USER_ID", ...],
    seen: ["USER_ID", ...],
    isGroup: false,
    lastUpdate: <DATE>
}
```
OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Message: POST
url: `/api/secure/message`

body:
```
{
    chatid: <CHAT_ID>,          // type: String, required
    link: true | false,         // type: Boolean, Not-requied
    body: <MESSAGE_BODY>        // type: String, required.
}
```
NB: link is true if message body is a link (of image/video or anything) Just for the ease of front-end parsing.

Requirements: User authentication and validation.

OnSuccess: Response.status will be 200(ok). 

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Chat: GET
url: `api/secure/chat` (for last 50 message threads) or `api/secure/chat?all=true` (for all the message threads)

Requirement: User authentication and validation.

OnSuccess: Response.status will be 200. Array of Chat will be shown. Chats will be given on the order of the latest activity.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Chat-chatid: GET
url: `api/secure/chat/{<CHAT_ID>}` (for last 50 messages) or `api/secure/chat/{<CHAT_ID>}` (for all messages)

OnSuccess: Response.status will be 200. Array of Messages will be shown.

Message Schema:
```
{
    sender: "<USER_ID>"
    chatid: "<CHAT_ID>"
    date: "<DATE>"
    link: true|false
    body: "<MESSAGE_BODY>"
    actor: "<USER_ID>"
    victim: ["<USER_ID>,...]
}
```
Points to be noted:
1. When member insertion is acted on a group, It will be notified as a message. For that message, Message.actor will be the actor of that action, Message.victim will be the array of people inserted, Message.sender will be "SYSTEM", Message.body will be "ADDED".
2. When member removal action is acted on a group,It will be notified as a message. For that message, Message.actor will be the actor of that action, Message.victim will be the array of people removed, Message.sender will be "SYSTEM", Message.body will be "REMOVED".
3. Else on all the other cases this will be perfect.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Add: POST
url: `/api/secure/add`

body:
```
{
    chatid: "<CHAT_ID>",
    members: ["<USER_ID>"]
}
```
Points to be noted.
1. No User_ID can be invalid or already in the group.
2. Adding will not work for singlular message threads.


Requirement: User authentication and validation.

OnSuccess: Response.status will be 200.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Remove: POST
url: `/api/secure/remove`

body:
```
{
    chatid: "<CHAT_ID>",
    members: ["<USER_ID>"]
}
```
Points to be noted.
1. No User_ID can be invalid and has to be already in the group.
2. Removing will not work for singlular message threads.


Requirement: User authentication and validation.

OnSuccess: Response.status will be 200.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Rename: POST
url: `/api/secure/rename`

body:
```
{
    chatid: "<CHAT_ID>",
    name: ["<USER_ID>"]
}
```

Requirement: User authentication and validation.

OnSuccess: Response.status will be 200.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.

## Search: GET
url: `/api/secure/search?email={EMAIL}`

Requirement: User authentication and validation.

OnSuccess: Response.status will be 200. User information will be provided if matched.

OnFail: Response.status will be an error code. Reason will be shown if possible to detect.