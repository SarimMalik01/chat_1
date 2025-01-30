const http=require("http");
const {Server}=require("socket.io");
const express=require("express");
const app=express();
const server=http.createServer(app);
const cors=require("cors");

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", 
        methods: ["GET", "POST"]
    }
});

io.on("connection",(socket)=>{
    console.log("A new user connected : "+socket.id)
    io.emit("user connected",socket.id)
    socket.on("user message",(message)=>{
        console.log(message)
        io.emit("server message",(message));
    })
    socket.on("disconnected",(msg)=>{
        console.log(msg)
        io.emit("user disconnected",(msg));
    })
    socket.on("typing",(msg)=>{
        console.log("typing");
        io.emit("typing",msg);
    })
})

server.listen(3000,()=>{
    console.log("Server connected on port 3000")
})