import classes from "./create.module.css";
import { useContext, useRef, useEffect, useState} from "react";
import { AppContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import bubbles from "../../assets/bubbles.mp3";

export default function Create({showCreate, setShowCreate}){
    const {socket} = useContext(AppContext);
    const uiClick = new Audio(bubbles);
    function handleCreate(difficulty){    
        const decoded = jwtDecode(localStorage.getItem("instanceToken"));
        socket.emit("create_crew", {instanceID: decoded.instanceID, difficulty: difficulty});
        uiClick.play();
        
    }

    if(!showCreate) return null;

    return(
        <div className={classes.backdrop}>
                    <div onClick={()=>setShowCreate(false)} style={{position:"absolute",height:"100%",width:"100%", zIndex:-1}}/>
                <div className={classes.popupBody}>
                        <button className={classes.whiteButton} onClick={()=>handleCreate(0)}>Easy</button>
                        <button className={classes.whiteButton} onClick={()=>handleCreate(1)}>Medium</button>
                        <button className={classes.whiteButton} onClick={()=>handleCreate(2)}>Hard</button>
                        <button className={classes.whiteButton} onClick={()=>handleCreate(3)}>Extreme</button>
                </div>
        </div>
    )
}