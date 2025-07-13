const express = require('express');
const http = require('http');
const cors = require("cors")
const {Server} = require('socket.io')
const app = express();

app.use(cors());
app.get("/", (req,res)=>{
    res.send("backend currently working and running")
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    socket.on("ping", ()=>{
        io.emit("reping")
    })
})

io.listen(5000)