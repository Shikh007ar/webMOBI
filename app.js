const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require("./utils/users");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const Admin = "webMobi";

app.get("/", function(req, res){
    res.render("main");
})
app.get("/join", function(req, res){
    res.render("join");
})
app.get("/users", function(req, res){
    res.render("users");
})

app.post("/create-user", function(req, res){
    console.log(req.body.username);
})

app.get("/chatbox", function(req, res){
    res.render("chatbox");
})

io.on("connection", socket => {
    socket.on("joinRoom", ({username}) =>{
        const user = userJoin(socket.id, username);

        socket.emit("message",  formatMessage(Admin, "welcome to webMobi"));

        socket.broadcast.emit("message", formatMessage(Admin, `${user.username} has joined the chat`));
    
        io.emit("roomUsers", {
            users: getRoomUsers(user.room)
        })
    });
    // console.log("New WS Connection...");

    socket.on("chatMessage",  msg => {
        const user = getCurrentUser(socket.id);
        io.emit("message", formatMessage(user.username, msg));
    })
    socket.on("disconnect", ()=>{
        const user = userLeaves(socket.id);
        if(user){
        io.emit("message", formatMessage(Admin, `${user.username} has left the chat`));
    }
    io.emit("roomUsers", {
        users: getRoomUsers()
    })
    })

})


server.listen(3000, function(){
    console.log("server is running on port 3000")
  });
  