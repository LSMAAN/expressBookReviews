const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
     // Check if session exists
  if (!req.session || !req.session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the access token stored in the session
    const decoded = jwt.verify(req.session.accessToken, "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    // If the token is invalid, clear the session and send an error response
    req.session.destroy();
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// const user = "John";
// const pass = "pass";

// let arr = [];

// arr[user] = pass;
// const user1 = "John1";
// const pass1 = "pass1";
// arr[user1] = pass1;
// let arr = [ {John: 'pass'}, {John1: 'pass1'} ];
// let result = arr.find(obj => obj.hasOwnProperty('John'));
// console.log(result);
// const user = arr[John];

// console.log(user); // Output: [John: "pass"]
// const users = [];

// const username1 = 'user1';
// const password1 = 'password1';

// const username2 = 'user2';
// const password2 = 'password2';

// const username3 = 'user3';
// const password3 = 'password3';

// users[username1] = password1;
// users[username2] = password2;
// users[username3] = password3;

// console.log(users[username2]);
const arr = [];
const user = "john";
const pass = "pass";
const user1 = "john1";
const pass1 = "pass1";
arr.push({user, pass});
arr.push({user1, pass1});
// if (users.find((user) => user.username === username)) {
//   return res.status(409).json({ message: "Username already exists" });
// }
//const temp = arr.find((u) => u.username === username);
//const isUserPresent = arr.some(obj => Object.values(obj).includes('john'));
//console.log(isUserPresent);

const PORT =5005;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
