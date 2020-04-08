//Dependencies
const http = require("http");
const fs = require("fs");
const express = require("express");
const path = require("path");
var savedNotes = []
var app = express();
const PORT = process.env.PORT || 3000;
// var server = http.createServer(handleRequest); 

//assists with data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.use('/assets', express.static('/public'));


//html route to return the notes file
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
   
});
//route to display test in the db.json file
app.get("/api/notes", (req, res) => {
    console.log("hit get")
    fs.readFile("./db/db.json", "utf-8", (err,data) => {
        if (err) throw err;
        console.log(data)
        res.json(JSON.parse(data));
        
    });
  
}); 
//html route to return to index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})


app.post("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf-8", (err,data) => {
        jsonFile = JSON.parse(data); 
        var newNoteItem = req.body;
        newNoteItem.id = jsonFile.length; 
        jsonFile.push(newNoteItem)
        jsonFile = JSON.stringify(jsonFile); 
        fs.writeFile('db/db.json', jsonFile, (err, data) => {
            console.log("successfully created new note")
            if (err) throw err; 
            res.json(jsonFile) 
    });

    });
   
});
app.delete("/api/notes/:id", function(req,res){
    const notesId = parseInt(req.params.id);
    console.log(notesId)
   fs.readFile("db/db.json", "utf-8", (err,data) => {
    jsonFile = JSON.parse(data); 
    const newArray = jsonFile.filter(item => {
        return item.id !== notesId
    }); console.log(newArray)
    fs.writeFile('db/db.json', JSON.stringify(newArray), (err, data) => {
        console.log("successfully deleted item")
        if (err) throw err; 
        res.json(newArray) 
});
   }); 
   
}); 



// app.post("/notes", function(req,res) {
//     var newNote = req.body; 
//     fs.appendFileSync('./db/db.json', render([newNote]), (req,res) => {
//     console.log("successfully created new note")
//     console.log(newNote); 
//     savedNotes.push(newNote); 

//     })
// console.log(newNote); 
// savedNotes.push(newNote); 
// res.json(newNote); 
// res.json(db.json); 


//   });
//   app.get("/api/notes", function(req,res){
//       res.json(db.json)
//   })
//   app.use('/api/notes', express.static(__dirname + 'db/db.json')); 

//code to "start" server
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});