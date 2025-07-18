import classes from "./popup.module.css";
import left from "../../assets/left.png";
import right from "../../assets/right.png";
import { useEffect, useRef, useContext, useState } from "react";
import { AppContext } from "../../App";
import {jwtDecode} from "jwt-decode";
import bubbles from "../../assets/bubbles.mp3";

export default function Popoup({showPopup, setShowPopup, setState}){
    const {socket, av, setAv, avatars} = useContext(AppContext);



    const userInput = useRef("");

    useEffect(()=>{
        
        socket.on("login", (data)=>{
            localStorage.clear();
            localStorage.setItem("instanceToken", data.instanceToken);
            setShowPopup(false);
            setState("crew");
        })

        if(localStorage.getItem("instanceToken")){
            const decoded = jwtDecode(localStorage.getItem("instanceToken"));
           
            
            setAv(decoded.avatar);
        }

        return(()=>{
            socket.off("login");
        })
    }, [])

    const uiClick = new Audio(bubbles);

    function handleLeft(){
        if(av>0){
            setAv(prev=>prev-1);
            uiClick.play();
        }
    }

    function handleRight(){
        if(av < avatars.length-1){
            setAv(prev=>prev+1);
            uiClick.play();
        }
    }

    function handleConfirm(){
        const username = userInput.current.value;
        if(username == ""){
            alert("must input username");
            return;
        }
        uiClick.play();
        socket.emit("create_user", {avatar: av, username: username});
        
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

                <input maxLength={15} ref={userInput} placeholder="username" value={localStorage.getItem("instanceToken") ? jwtDecode(localStorage.getItem("instanceToken")).username : "" }/>
                <button onClick={handleConfirm} className={classes.whiteButton}>Confirm</button>
            </div>
        </div>
        
    )
}