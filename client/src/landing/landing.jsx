import classes from "./landing.module.css";
import submarine from "../assets/submarine.png"
import Popup from "./popup/popup.jsx";
import Join from "./join/join.jsx";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../App.jsx";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ambiance from "../assets/ambiance.mp3";
import bubbles from "../assets/bubbles.mp3";
import Create from "./create/create.jsx";
import Instructions from "./instructions/instructions.jsx";
import placeholder from "../assets/placeholder.png";
const ambianceAudio = new Audio(ambiance);
ambianceAudio.loop = true;
ambianceAudio.volume = 0.1;
//declared audio globally so it doesnt keep making a new audio instance every refresh
//and
const uiClick = new Audio(bubbles);
export default function Landing(){
    const [showPopup, setShowPopup] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [roomID, setRoomID] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const {socket, state, setState, setDifficulty, joinedPlayers, setJoinedPlayers, avatars} = useContext(AppContext);
    const [openInstructions, setOpenInstructions] = useState(false);
    const [loading , setLoading] = useState(false);
    const [notif, setNotif] = useState([]);
    const navigate = useNavigate()
    
    useEffect(()=>{
        ambianceAudio.pause();
        ambianceAudio.currentTime = 0;
        if(state!="lobby"){
            setJoinedPlayers([])
        }
        
        setState("username");
        socket.emit("reconnect", {roomID: localStorage.getItem("roomID")});

        socket.on("begin", (data)=>{
            setState("start")
            navigate("/start");
            uiClick.play();
            const playDelay = setTimeout(()=>{
                ambianceAudio.play();
                clearTimeout(playDelay);
            }, 2000)
        })

        socket.on("join_lobby", (data)=>{
            setShowJoin(false);
            setShowCreate(false);
            setState("lobby");
            localStorage.setItem("roomID", data.roomID);
            setRoomID(localStorage.getItem("roomID"));
            setDifficulty(data.difficulty);
            console.log(data.difficulty);
            setLoading(false);
        })

        socket.on("notify_join", (data)=>{
            console.log("joined players " + data.joinedPlayers);
            setJoinedPlayers(data.joinedPlayers);
            
        })

        return(()=>{
            socket.off("join_lobby");
            socket.off("begin");
        })
    }, [])


    function handlePlay(){
        setShowPopup(true);
        uiClick.play();
    }

    function createCrew(){
        setShowCreate(true);
        uiClick.play();
    }

    function joinCrew(){
        setShowJoin(true);
        uiClick.play();
    }

    function Release(){
        const roomID = localStorage.getItem("roomID");
        const decoded = jwtDecode(localStorage.getItem("instanceToken"));
        socket.emit("start", {roomID: roomID, instanceID: decoded.instanceID});
    }

    return(  
        <div className={classes.background}>
            <Instructions openInstructions={openInstructions} setOpenInstructions={setOpenInstructions}/>
            <Popup showPopup={showPopup} setShowPopup={setShowPopup} state={state} setState={setState} setLoading={setLoading} loading={loading}/>
            <Join showJoin={showJoin} setShowJoin={setShowJoin} state={state} setState={setState}/>
            <Create showCreate={showCreate} setShowCreate={setShowCreate}/>
            <div className={classes.header}>
                <div className={state !== "lobby" ? null : classes.hidden}>
                    <h1>Made by</h1>
                    <a href={"mailto:Soon128HD@gmail.com"}><h2>Ien Sagmit</h2></a>
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
                
                
                <div style={{display:"flex", justifyContent:"center", alignItems: "center"}}>
                    <div className={classes.right}>
                        {
                            joinedPlayers.map((p)=>{
                                return(
                                    <div className={classes.notif}>
                                        <img src={avatars[p.avatar]} style={{marginRight: "5px"}}/>
                                        <h5>{p.username}</h5>
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                    <div className={classes.playersWrapper}>
                        <img className={classes.players} src={avatars[joinedPlayers[3]?.avatar] || placeholder}/>
                        <img className={classes.players} src={avatars[joinedPlayers[2]?.avatar] || placeholder}/>
                        <img className={classes.players} src={avatars[joinedPlayers[1]?.avatar] || placeholder}/>
                        <img className={classes.players} src={avatars[joinedPlayers[0]?.avatar] || placeholder}/>
                    </div>  

                     
                    <img src={submarine}/>
                </div>
                
                
                <div className={classes.buttonWrapper}>
                    <button className={state == "username" ? classes.blueButton : classes.hidden} onClick={handlePlay}>Play</button>

                    <button className={state == "crew" ? classes.blueButton : classes.hidden} onClick={createCrew}>Create Crew</button>
                    <button className={state == "crew" ? classes.blueButton : classes.hidden} onClick={joinCrew}>Join Crew</button>

                    <button className={state == "lobby" ? classes.blueButton : classes.hidden} onClick={Release}>Release</button>

                    <div className={classes.bottom}>
                        <button className={classes.blueButton} onClick={()=>{setOpenInstructions(true); uiClick.play()}}>Instructions</button>
                    </div>
                </div>

                
                

            </div>
            <div className={classes.water}/>
        </div>
    )
}