const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
const { json } = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.get("/user", (req, res) => {
//   res.send(JSON.stringify(users, null, 2));
// });

// public_users.get('/booksView',function (req, res) {
//   //Write your code here
//   return res.send(books);
// });


//Get all books using Async callbacks
public_users.get("/server/asynbooks", async function (req,res) {
  try {
    let response = await axios.get("http://localhost:5005/");
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting book list"});
  }
});
// public_users.post("/register", (req,res) => {
//   //Write your code here
//   const { username, password } = req.body;  
//   if (!username || !password) {  
//     res.status(400).send('Username and password are required');  
//   } else if (users[username]) { 
//     res.status(409).send('Username already exists');  
//   } else {
//     users[username] = password; 
//     res.status(201).send('User registered successfully');  
//   }
// });

// public_users.post("/register", (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password are required" });
//   }
//   if (!isValid(username)) {
//     return res.status(400).json({ message: "Username already exists" });
//   }
//   users.push({ username, password });
//   return res.status(200).json({ message: "User registered successfully" });
// });

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// public_users.post("/users", (req, res) => {
//   const user = req.body.username;
//   const newUser = users[user];
//   res.send("USer is "+ newUser);
// });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// public_users.get('/', async function (req, res) {
//   try {
//     const response = await axios.get('http://localhost:5005/books');
//     const books = response.data;
//     return res.status(200).json(books);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({message: "Error getting book list"});
//   }
// });

// public_users.get('/isbn/:isbn', async function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn]; 
//   console.log(book);
//   if(book){
//     try{
//       const response = await axios.get(`http://localhost:5005/books`);
//       //const data = response.data;
//       const books = response.data;
//       const book = books[isbn]
//       const bookInfo = {
//         "title": book.title,
//         "author": book.author,
//         "description": data.items[0].volumeInfo.description,
//         "publisher": data.items[0].volumeInfo.publisher,
//         "publishedDate": data.items[0].volumeInfo.publishedDate,
//         "pageCount": data.items[0].volumeInfo.pageCount,
//         "language": data.items[0].volumeInfo.language,
//         "previewLink": data.items[0].volumeInfo.previewLink
//       }
//       return res.status(200).json(bookInfo);
//     }
//     catch(error){
//       console.log(error);
//       return res.status(500).json({message: "Error while fetching book details."})
//     }
//   }
//   else{
//     return res.status(404).json({message: "Book not found."});
//   }
// });


//Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
 });

 //Get book details by ISBN using Promises
 public_users.get("/server/asynbooks/isbn/:isbn", function (req,res) {
  let {isbn} = req.params;
  axios.get(`http://localhost:5005/isbn/${isbn}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;  
  const authorBooks = [];  
  
  for (const book in books) {  
    if (books[book].author === author) {  
      authorBooks.push(books[book]);
    }
  }
  
  if (authorBooks.length > 0) {  
    res.send(authorBooks);  
  } else {
    res.status(404).send('No books found for author');  
  }
});

//Get book details by author using promises
public_users.get("/server/asynbooks/author/:author", function (req,res) {
  let {author} = req.params;
  axios.get(`http://localhost:5005/author/${author}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
    if(filteredBooks.length > 0){
        return res.status(200).json(filteredBooks);
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Get all books based on title using promises
public_users.get("/server/asynbooks/title/:title", function (req,res) {
  let {title} = req.params;
  axios.get(`http://localhost:5005/title/${title}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    const reviews = books[isbn].reviews;
    return res.status(200).json({ reviews: reviews });
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

