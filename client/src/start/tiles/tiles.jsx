import classes from "./tiles.module.css";
import { useRef, useState, useContext, useEffect } from "react";
import {AppContext} from "../../App.jsx";
import { jwtDecode } from "jwt-decode";
import tiles from "../../assets/tiles.mp3"
import wordSuccess from "../../assets/success.mp3";
import wordDeny from "../../assets/denied.mp3"

export default function Tiles({setEffects, setBoss, boss, over, setOver, difficulty, setInteract}){
    const [word, setWord] = useState("");    
    const wordInput = useRef();
    const {socket} = useContext(AppContext);
    const [denied, setDenied] = useState(false);
    const [length, setLength] = useState(5);
    useEffect(()=>{
        socket.on("accept_word", (data)=>{
            const successSound = new Audio(wordSuccess);
            successSound.play();
            setEffects(prev=>prev.concat({word: data.word, avatar: data.avatar, username: data.username, oxadd:data.oxygen}));
        })

        socket.on("deny",()=>{
            animateDeny()
        })

       
        setLength(prev=> difficulty == 0 ? 3 : prev);
        setLength(prev=> difficulty == 1 ? 4 : prev);
        setLength(prev=> difficulty >= 2 ? 5 : prev);
        
        

        return(()=>{
            socket.off("accept_word");
            socket.off("deny");
        })
    }
    ,[])

    function handleChange(){    
        let input = wordInput.current.value.toUpperCase().toUpperCase().replace(/\s+/g, "")
        wordInput.current.value = input  
        const tileSound = new Audio(tiles);
        tileSound.volume = 0.6
        tileSound.play();      
        setWord(input);    
        setInteract(true)
    }

    async function handleSubmit(event){
        event.preventDefault();
        const real = await wordCheck(word);
        

        if(word.length < length || !real){
            animateDeny();
            return;
        } 
        
        const deoded = jwtDecode(localStorage.getItem("instanceToken"));
        socket.emit("send_word", {word: word, roomID: localStorage.getItem("roomID"), instanceID: deoded.instanceID});
        wordInput.current.value = "";
        wordInput.current?.focus()
        setWord("");
    }

    async function wordCheck(word) {
        

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

            if (!response.ok) {
                //apperantly when word is not real it errors so yes
                return false;
            }
            
            return true;

        } catch (error) {
            return false;
        }
    }

    function animateDeny(){
        //simple animation for when invalid word
        wordInput.current?.focus()
        const denySound = new Audio(wordDeny);
        denySound.play();
        setDenied(true);
        setTimeout(()=>{setDenied(false)}, 500)
        
    }

    function focusInputSafely() {
        //this is for the audio
        setInteract(true);
        if (!over) {
                requestAnimationFrame(() => {
                wordInput.current?.focus();
            });
        }
    }


    return(
        <div className={classes.tilesWrapper} onClick={() => focusInputSafely()}>
            <form onSubmit={handleSubmit} style={{position: "absolute",
                                                                top: "-10vh",
                                                                left: "-10vw",
                                                                width: "200px",
                                                                height: "400px",
                                                                border: "none",
                                                                padding: 0,
                                                                margin: 0,
                                                                opacity: 1,
                                                                fontSize: 16, 
                                                                zIndex: 0,}}>
                <input autoFocus disabled={over} onChange={handleChange} ref={wordInput} maxLength={5}/>
            </form>
            
            <div className={`${classes.tile} ${denied ? classes.denied : ""} ${boss > 0 ? classes.bossFight : ""}`} onClick={() => focusInputSafely()}>{word[0]}</div>
            <div className={`${classes.tile} ${denied ? classes.denied : ""} ${boss > 0 ? classes.bossFight : ""}`} onClick={() => focusInputSafely()}>{word[1]}</div>
            <div className={`${classes.tile} ${denied ? classes.denied : ""} ${boss > 0 ? classes.bossFight : ""}`} onClick={() => focusInputSafely()}>{word[2]}</div>
            <div className={`${classes.tile} ${length < 4 ?  classes.gold : ""} ${denied ? classes.denied : ""} ${boss > 0 ? classes.bossFight : ""}`} onClick={() => focusInputSafely()}>{word[3]}</div>
            <div className={`${classes.tile} ${length < 5 ?  classes.gold : ""} ${denied ? classes.denied : ""} ${boss > 0 ? classes.bossFight : ""}`} onClick={() => focusInputSafely()}>{word[4]}</div>
        </div>
    )
}