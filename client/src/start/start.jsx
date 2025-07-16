import classes from "./start.module.css";
import { useEffect, useState, useContext } from "react";
import submarine from "../assets/submarine.png"
import {AppContext} from "../App.jsx";
import Oxygen from "./oxygen/oxygen.jsx";
import Tiles from "./tiles/tiles.jsx";
import Effect from "./effect/effect.jsx";
import Lost from "./lost/lost.jsx";
import Win from "./win/win.jsx";

export default function Start(){

    const { socket } = useContext(AppContext);
    const [depth, setDepth] = useState(0);
    const [oxygen, setOxygen] = useState(100);
    const [effects, setEffects] = useState([]);
    const [lost, setLost] = useState(false);
    const [lastDepth, setLastDepth] = useState();
    const [wordCount, setWordCount] = useState();
    const [win, setWin] = useState(false);
    const [time, setTime] = useState();

    useEffect(() => {
        socket.on("depth_update", ({ depth, oxygen, state }) => {
            setDepth(depth);
            setOxygen(oxygen);
            console.log(depth);
        });

        socket.on("win", (data)=>{
            setWordCount(data.wordCount);
            setTime(data.time);
            setWin(true);
        })

        socket.on("lose", (data)=>{
            setLastDepth(data.depth);
            setWordCount(data.wordCount);
            setLost(true);

        })

        return () => {
            socket.off("depth_update");
            socket.off("win");
            socket.off("lose");
        };

    }, []);

    return(
        <div className={classes.background}>
            <Win win={win} wordCount={wordCount} time={time}/>
            <Lost lost={lost}  lastDepth={lastDepth} wordCount={wordCount}/>
            <Oxygen oxygen={oxygen}/>
            <div className={classes.center}>
                {
                    effects.map((effect)=>{
                        return(<Effect word={effect.word} avatar={effect.avatar} username={effect.username}/>)
                    })
                }
                <img src={submarine} className={classes.submarine}/>
            </div>

            <div className={classes.map} style={{ transform: `translateY(-${depth}px)`}}>
                <div className={classes.water1}/>
                <div className={classes.water2}/>
                <div className={classes.water3}/>
                <div className={classes.water4}/>
            </div>

            <Tiles setEffects={setEffects}/>
        </div>
    )
}