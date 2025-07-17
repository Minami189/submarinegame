import classes from "./landing.module.css";
import submarine from "../assets/submarine.png"
import Popup from "./popup/popup.jsx";
import Join from "./join/join.jsx";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../App.jsx";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ambiance from "../assets/ambiance.mp3";
const ambianceAudio = new Audio(ambiance);
ambianceAudio.loop = true;
ambianceAudio.volume = 0.1;
//declared audio globally so it doesnt keep making a new audio instance every refresh
//and

export default function Landing(){
    const [showPopup, setShowPopup] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [roomID, setRoomID] = useState("");
    const {socket, state, setState} = useContext(AppContext);
    const navigate = useNavigate()
    
    useEffect(()=>{
        ambianceAudio.pause();
        ambianceAudio.currentTime = 0;

        socket.on("begin", (data)=>{
            setState("start")
            navigate("/start");
            const playDelay = setTimeout(()=>{
                ambianceAudio.play();
                clearTimeout(playDelay);
            }, 2000)
        })

        socket.on("join_lobby", (data)=>{
            setShowJoin(false);
            setState("lobby");
            localStorage.setItem("roomID", data.roomID);
            setRoomID(localStorage.getItem("roomID"));
        })

        return(()=>{
            socket.off("join_lobby");
            socket.off("begin");
        })
    }, [])

    function handlePlay(){
        setShowPopup(true);
    }

    function createCrew(){
        const decoded = jwtDecode(localStorage.getItem("instanceToken"));

        socket.emit("create_crew", {instanceID: decoded.instanceID});
    }

    function joinCrew(){
        setShowJoin(true);
    }

    function Release(){
        const roomID = localStorage.getItem("roomID");
        const decoded = jwtDecode(localStorage.getItem("instanceToken"));
        socket.emit("start", {roomID: roomID, instanceID: decoded.instanceID});
    }

    return(  
        <div className={classes.background}>
            <Popup showPopup={showPopup} setShowPopup={setShowPopup} state={state} setState={setState}/>
            <Join showJoin={showJoin} setShowJoin={setShowJoin} state={state} setState={setState}/>
            <div className={classes.header}>
                <div className={state !== "lobby" ? null : classes.hidden}>
                    <h1>Made by</h1>
                    <h2>Ien Sagmit</h2>
                </div>

                <div className={state === "lobby" ? null : classes.hidden}>
                    <h2>{roomID}</h2>
                </div>
            </div>

            <div className={classes.submarineWrapper}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <h1>Deep Dive</h1>
                    <h3>Inspired by Neal's "the deep sea"</h3>
                </div>
                
                <img src={submarine}/>
                
                <div className={classes.buttonWrapper}>
                    <button className={state == "username" ? classes.blueButton : classes.hidden} onClick={handlePlay}>Play</button>

                    <button className={state == "crew" ? classes.blueButton : classes.hidden} onClick={createCrew}>Create Crew</button>
                    <button className={state == "crew" ? classes.blueButton : classes.hidden} onClick={joinCrew}>Join Crew</button>

                    <button className={state == "lobby" ? classes.blueButton : classes.hidden} onClick={Release}>Release</button>
                </div>
                

            </div>
            <div className={classes.water}/>
        </div>
    )
}