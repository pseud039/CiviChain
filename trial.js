import express from "express"
// const express = require("express");

const app = express();

// app.get('/',(req, res)=>{
//     res.send("Server is ready");
// });
app.get('/jokes',(req,res)=>{
    const jokes = [
  {
    "type": "general",
    "setup": "What do you get when you cross a chicken with a skunk?",
    "punchline": "A fowl smell!",
    "id": 230
  },
  {
    "type": "general",
    "setup": "What did the Red light say to the Green light?",
    "punchline": "Don't look at me I'm changing!",
    "id": 182
  },
  {
    "type": "general",
    "setup": "What does an angry pepper do?",
    "punchline": "It gets jalapeño face.",
    "id": 236
  },
  {
    "type": "general",
    "setup": "What do you call cheese by itself?",
    "punchline": "Provolone.",
    "id": 222
  },
  {
    "type": "knock-knock",
    "setup": "Knock knock. \n Who's there? \n Cows go. \n Cows go who?",
    "punchline": "No, cows go moo.",
    "id": 12
  },
  {
    "type": "general",
    "setup": "What do you call a singing Laptop?",
    "punchline": "A Dell",
    "id": 7
  },
  {
    "type": "general",
    "setup": "Bad at golf?",
    "punchline": "Join the club.",
    "id": 79
  },
  {
    "type": "general",
    "setup": "Did you hear about the bread factory burning down?",
    "punchline": "They say the business is toast.",
    "id": 84
  },
  {
    "type": "programming",
    "setup": "What do you get when you cross a React developer with a mathematician?",
    "punchline": "A function component.",
    "id": 412
  },
  {
    "type": "programming",
    "setup": "Why did the designer break up with their font?",
    "punchline": "Because it wasn't their type.",
    "id": 436
  }
];
res.send(jokes);
});

const port = process.env.PORT ||3000;

app.listen(port,()=>{
    console.log(`Serve at http://localhost:${port}`);
})