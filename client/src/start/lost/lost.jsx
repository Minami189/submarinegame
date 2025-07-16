import classes from "./lost.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../App";

export default function Lost({lost, lastDepth, wordCount}){
    const navigate = useNavigate();
    const {setState} = useContext(AppContext);

    function playAgain(){
        localStorage.removeItem("roomID");
        setState("username");
        navigate("/");
    }


    if(!lost) return null;

    return(
        <div className={classes.backdrop}>
            <div className={classes.lostBody}>
                <h2>You Ran Out Of Oxygen!</h2>
                <h1>Depth: {lastDepth}</h1>
                <h1>Word Count: {wordCount}</h1>
                <button onClick={playAgain} className={classes.blueButton}>Play again</button>
            </div>
        </div>
        
    )
}