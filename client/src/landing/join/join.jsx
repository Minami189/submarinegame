import classes from "./join.module.css";
import { useContext, useRef, useEffect } from "react";
import { AppContext } from "../../App";
import { jwtDecode } from "jwt-decode";
export default function Join({showJoin, setShowJoin, state, setState}){
    const {socket} = useContext(AppContext);
    const roomInput = useRef();


    useEffect(()=>{
        socket.on("no_room", ()=>{
            alert("cannot join room");
        })

        
    },[])

    function handleJoin(){
        const roomID = roomInput.current.value;
        const decoded = jwtDecode(localStorage.getItem("instanceToken"));
        socket.emit("join_crew", {roomID: roomID, instanceID: decoded.instanceID});
    }


    if(!showJoin){
        return;
    }

    return(
        <div className={classes.backdrop}>
            <div onClick={()=>setShowJoin(false)} style={{position:"absolute",height:"100%",width:"100%", zIndex:-1}}/>
            <div className={classes.popupBody}>
                <input placeholder="code" ref={roomInput}/>
                <button className={classes.whiteButton} onClick={handleJoin}>Join Crew</button>
            </div>
        </div>
    )
}