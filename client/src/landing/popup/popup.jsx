import classes from "./popup.module.css";
import left from "../../assets/left.png";
import right from "../../assets/right.png";
import { useEffect, useRef, useContext, useState } from "react";
import { AppContext } from "../../App";
import {jwtDecode} from "jwt-decode";

export default function Popoup({showPopup, setShowPopup, setState}){
    const {socket, av, setAv, avatars} = useContext(AppContext);



    const userInput = useRef("");

    useEffect(()=>{
       
        socket.on("login", (data)=>{
            localStorage.clear();
            localStorage.setItem("instanceToken", data.instanceToken);
            setShowPopup(false);
        })

        return(()=>{
            socket.off("login");
        })
    },[])

    function handleLeft(){
        if(av>0){
            setAv(prev=>prev-1);
        }
    }

    function handleRight(){
        if(av < avatars.length-1){
            setAv(prev=>prev+1);
        }
    }

    function handleConfirm(){
        const username = userInput.current.value;
        if(username == ""){
            alert("must input username");
            return;
        }
        socket.emit("create_user", {avatar: av, username: username});
        setState("crew");
        
    }


    if(!showPopup){
        return null;
    }
    return(
        <div className={classes.backdrop}>
            <div onClick={()=>setShowPopup(false)} style={{position:"absolute",height:"100%",width:"100%", zIndex:-1}}/>
            <div className={classes.popupBody}>

                <div className={classes.avatarWrapper}>
                    <img src={left} onClick={handleLeft} className={classes.uiImage}/>
                    <img src={avatars[av]} className={classes.avatarImage}/>
                    <img src={right} onClick={handleRight} className={classes.uiImage}/>
                </div>

                <input maxLength={15} ref={userInput} placeholder="username"/>
                <button onClick={handleConfirm} className={classes.whiteButton}>Confirm</button>
            </div>
        </div>
        
    )
}