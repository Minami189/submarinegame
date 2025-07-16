const express = require('express');
const http = require('http');
const cors = require("cors")
const {Server} = require('socket.io')
const app = express();
const Chance = require('chance');
const chance = new Chance();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()

app.use(cors());
app.get("/", (req,res)=>{
    res.send("backend currently working and running")
})
const server = http.createServer(app);
server.listen(5000);
const players = {};

const rooms = {};


const io = new Server(server, {
    cors: {
        origin: process.env.FRONTENT_URL,
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    console.log("connected to " + socket.id)
    socket.on("ping", ()=>{
        console.log("connected to " + socket.id)
    })

    socket.on("create_user", (data)=>{
        const instanceID = chance.string({length: 10});
        players[instanceID] = {username: data.username, avatar: data.avatar, instanceID: instanceID};
        const instanceToken = jwt.sign({username: data.username, avatar: data.avatar, instanceID: instanceID}, process.env.PRIVATE_KEY);
        socket.emit("login", {instanceToken: instanceToken});
    })

    socket.on("create_crew", (data)=>{
        const instanceID = data.instanceID;
        socket.rooms.forEach((v)=>{
            if(v != socket.id){
                socket.leave(v);
            }
        })

        const roomID = chance.string({length: 5});
        rooms[roomID] = {
            roomID: roomID,
            started: false,
            oxygen: 100,
            host: instanceID,
            timeStarted: Date.now(),
            wordsInputted: [],
            players: [{username: players[instanceID].username, avatar: players[instanceID].avatar}],
            state: "lobby",
            depth: 0,
            interval: setInterval(()=>{
                if(rooms[roomID].started){
                    rooms[roomID].depth += 25;
                    rooms[roomID].oxygen -= 1;
                    if(rooms[roomID].oxygen <= 0){
                        rooms[roomID].state = "lose"
                    }

                    io.to(roomID).emit("depth_update", {
                        depth: rooms[roomID].depth,
                        oxygen: rooms[roomID].oxygen,
                        state: rooms[roomID].state
                    });

                    if(rooms[roomID].oxygen <= 0) {
                        rooms[roomID].state = "lose";
                        clearInterval(rooms[roomID].interval)
                        io.to(roomID).emit("lose", {wordCount: rooms[roomID].wordsInputted.length, depth: rooms[roomID].depth});
                    }

                    if(rooms[roomID].depth >= 30000){
                        rooms[roomID].state = "win";
                        clearInterval(rooms[roomID].interval)
                        io.to(roomID).emit("win", {wordCount: rooms[roomID].wordsInputted.length, time: Math.round((Date.now() - rooms[roomID].timeStarted)/1000), wordCount: rooms[roomID].wordsInputted.length});
                    }
                }

                

            }, 500)
        }
        socket.join(roomID);
        socket.emit("join_lobby", {roomID: roomID});
        console.log(rooms[roomID]);
    })

    socket.on("join_crew", (data)=>{
        const instanceID = data.instanceID;
        socket.rooms.forEach((v)=>{
            if(v != socket.id){
                socket.leave(v);
            }
        })

    
        if(!rooms[data.roomID] || [data.roomID] == "" || [data.roomID] == null){
            return
        }

        const joinedRoom = rooms[data.roomID];
        if(!joinedRoom || joinedRoom.started){
            socket.emit("no_room");
            return;
        }

        rooms[data.roomID].players.push({username: players[instanceID].username, avatar: players[instanceID].avatar});
        console.log(rooms[data.roomID].players);
        socket.join(data.roomID);
        socket.emit("join_lobby", {roomID: data.roomID});
    })

    socket.on("start", (data)=>{
        if(!rooms[data.roomID] || [data.roomID] == "" || [data.roomID] == null){
            return
        }

        const roomID = data.roomID;
        if(!rooms[roomID]) return;

        if(data.instanceID !== rooms[roomID].host) return
        rooms[roomID].started = true;
        rooms[roomID].timeStarted = Date.now();
        io.to(roomID).emit("begin");
    })

    socket.on("send_word", (data)=>{
        if(!rooms[data.roomID] || [data.roomID] == "" || [data.roomID] == null){
            return
        }

        const foundWord = rooms[data.roomID].wordsInputted.find((word)=> word === data.word);

        if(foundWord){
            socket.emit("deny");
            console.log(data.word + " already exists");
            return;
        } 

        rooms[data.roomID].oxygen += 5;
        rooms[data.roomID].depth += 75;
        rooms[data.roomID].wordsInputted.push(data.word);
        io.to(data.roomID).emit("accept_word", {word: data.word, avatar:players[data.instanceID].avatar, username:players[data.instanceID].username});
    })
})
 
