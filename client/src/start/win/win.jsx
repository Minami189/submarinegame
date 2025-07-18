import classes from './win.module.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

export default function Win({time, win, wordCount, pWordCount, difficulty}){
       
        const navigate = useNavigate();
        const {setState, avatars} = useContext(AppContext);
        const [currDiff, setCurrDiff] = useState("easy");

        function playAgain(){
            localStorage.removeItem("roomID");
            setState("username");
            navigate("/");
        }

        useEffect(()=>{
            setCurrDiff(prev=> difficulty == 0 ? "easy" : prev)
            setCurrDiff(prev=> difficulty == 1 ? "medium" : prev)
            setCurrDiff(prev=> difficulty == 2 ? "hard" : prev)
            setCurrDiff(prev=> difficulty == 3 ? "extreme" : prev)
        }, [])

    if(!win) return null;

    return(
        <div className={classes.backdrop}>
            <div className={classes.winBody}>
                <h2>You Reached</h2> 
                <h2>the End!</h2>
                <h1 style={{marginTop: "15px"}}>🚩{time} seconds</h1>
                <h1 style={{marginTop: "5px"}}>{currDiff}</h1>
                <div className={classes.playerWC}>

                
                    {
                        pWordCount.map((p)=>{
                            return(
                                <div className={classes.statWrapper}>
                                    <img src={avatars[p.avatar]} style={{width: "35px", height: "35px", borderRadius: "50%"}}/>
                                    <div className={classes.statContent}>
                                        <p>{p.username}</p>
                                        <h4>{`${p.count} word(s)`}</h4>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <button onClick={playAgain} className={classes.blueButton}>Play again</button>
            </div>
        </div>
    )
}
