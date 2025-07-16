import classes from './win.module.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

export default function Win({time, win, wordCount}){

        const navigate = useNavigate();
        const {setState} = useContext(AppContext);
    
        function playAgain(){
            localStorage.removeItem("roomID");
            setState("username");
            navigate("/");
        }

    if(!win) return null;

    return(
        <div className={classes.backdrop}>
            <div className={classes.winBody}>
                <h2>You Reached the End!</h2>
                <h1>🚩{time} seconds</h1>
                <h1>Word Count: {wordCount}</h1>
                <button onClick={playAgain} className={classes.blueButton}>Play again</button>
            </div>
        </div>
    )
}