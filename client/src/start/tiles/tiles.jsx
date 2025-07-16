import classes from "./tiles.module.css";
import { useRef, useState, useContext, useEffect } from "react";
import {AppContext} from "../../App.jsx";
import { jwtDecode } from "jwt-decode";
import tiles from "../../assets/tiles.mp3"
import wordSuccess from "../../assets/success.mp3";
import wordDeny from "../../assets/denied.mp3"

export default function Tiles({setEffects}){
    const [word, setWord] = useState("");    
    const wordInput = useRef();
    const {socket} = useContext(AppContext);
    const [denied, setDenied] = useState(false);
    useEffect(()=>{
        socket.on("accept_word", (data)=>{
            const successSound = new Audio(wordSuccess);
            successSound.play();
            setEffects(prev=>prev.concat({word: data.word, avatar: data.avatar, username: data.username}));
        })

        socket.on("deny",()=>{
            animateDeny()
        })

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
    }

    async function handleSubmit(event){
        event.preventDefault();

        const real = await wordCheck(word);
        if(word.length < 5 || real == false){
            animateDeny();
            return;
        } 
        const deoded = jwtDecode(localStorage.getItem("instanceToken"));
        socket.emit("send_word", {word: word, roomID: localStorage.getItem("roomID"), instanceID: deoded.instanceID});
        wordInput.current.value = "";
        setWord("");
    }

    async function wordCheck(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

            if (!response.ok) {
                //apperantly when word is not real it errors so yes
                return false;
            }
            const data = await response.json();
            console.log(data);
            return true;

        } catch (error) {
            return false;
        }
    }

    function animateDeny(){
        //simple animation for when invalid word
        const denySound = new Audio(wordDeny);
        denySound.play();
        setDenied(true);
        setTimeout(()=>{setDenied(false)}, 500)
    }


    return(
        <div className={classes.tilesWrapper} onClick={() => wordInput.current?.focus()}>
            <form onSubmit={handleSubmit}>
                <input style={{position: "absolute", zIndex: -10}} autoFocus onChange={handleChange} ref={wordInput} maxLength={5} onBlur={()=>wordInput.current.focus()}/>
            </form>
            
            <div className={`${classes.tile} ${denied ? classes.denied : ""}`} onClick={() => wordInput.current?.focus()}>{word[0]}</div>
            <div className={`${classes.tile} ${denied ? classes.denied : ""}`} onClick={() => wordInput.current?.focus()}>{word[1]}</div>
            <div className={`${classes.tile} ${denied ? classes.denied : ""}`} onClick={() => wordInput.current?.focus()}>{word[2]}</div>
            <div className={`${classes.tile} ${denied ? classes.denied : ""}`} onClick={() => wordInput.current?.focus()}>{word[3]}</div>
            <div className={`${classes.tile} ${denied ? classes.denied : ""}`} onClick={() => wordInput.current?.focus()}>{word[4]}</div>
        </div>
    )
}