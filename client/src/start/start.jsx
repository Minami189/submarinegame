import classes from "./start.module.css";
import { useEffect, useState, useContext, useRef } from "react";
import submarine from "../assets/submarine.png"
import {AppContext} from "../App.jsx";
import Oxygen from "./oxygen/oxygen.jsx";
import Tiles from "./tiles/tiles.jsx";
import Effect from "./effect/effect.jsx";
import Lost from "./lost/lost.jsx";
import Win from "./win/win.jsx";
import Boss from "./boss/boss.jsx";
import bossAudio from "../assets/boss.mp3"
import placeholder from "../assets/placeholder.png";
import { useNavigate } from "react-router-dom";
const bossMusic = new Audio(bossAudio);


export default function Start(){

    const { socket, difficulty, setDifficulty, joinedPlayers, avatars, setJoinedPlayers, ambianceAudio} = useContext(AppContext);
    const [depth, setDepth] = useState(0);
    const [oxygen, setOxygen] = useState(100);
    const [effects, setEffects] = useState([]);
    const [lost, setLost] = useState(false);
    const [lastDepth, setLastDepth] = useState();
    const [wordCount, setWordCount] = useState();
    const [win, setWin] = useState(false);
    const [time, setTime] = useState();
    const [boss, setBoss] = useState(0);
    const [over, setOver] = useState(false);
    const [pWordCount, setPWordCount] = useState([]);
    const [interact, setInteract] = useState(false);
    
    
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(()=>{
            ambianceAudio.volume = 0.1;
            ambianceAudio.loop = true;
            ambianceAudio.play();
        },2000)
        

        socket.emit("reconnect", {roomID: localStorage.getItem("roomID")});
        console.log("interacted")
    
        

        socket.on("update_state", (data)=>{
            if(data.state == "win" || data.state == "lose"){
                navigate('/');
            }

            console.log("boss is " + data.boss)
            setBoss(data.boss);
            setJoinedPlayers(data.joinedPlayers);
            console.log("reconnect");
        })

        socket.on("depth_update", ({ depth, oxygen, state }) => {
            setDepth(depth);
            setOxygen(oxygen);
        });

        socket.on("win", (data)=>{
            setWordCount(data.wordCount);
            setTime(data.time);
            setWin(true);
            setPWordCount(data.playerWordCount);
            bossMusic.currentTime = 0;
            bossMusic.loop = false;
            bossMusic.pause();
            setOver(true);
        })

        socket.on("lose", (data)=>{
            setLastDepth(Math.floor(data.depth/8));
            setWordCount(data.wordCount);
            setLost(true);
            setPWordCount(data.playerWordCount);
            bossMusic.currentTime = 0;
            bossMusic.loop = false;
            bossMusic.pause();
            setOver(true);
        })

        socket.on("boss", (data)=>{
            setBoss(data.boss);
            bossMusic.loop = true;
            bossMusic.play();
        })

        return () => {
            socket.off("depth_update");
            socket.off("win");
            socket.off("lose");
            socket.off("update_state")
        };

    }, []);

    useEffect(()=>{
        if(interact){
            if(boss > 0){
                bossMusic.loop = true;
                bossMusic.play();
            }
            setTimeout(()=>{
                ambianceAudio.volume = 0.1;
                ambianceAudio.loop = true;
                ambianceAudio.play();
            },2000)
        }
    }, [interact])




    return(
        <div className={classes.background}>
            <Win win={win} wordCount={wordCount} time={time} pWordCount={pWordCount} difficulty={difficulty}/>
            <Lost lost={lost}  lastDepth={lastDepth} wordCount={wordCount} pWordCount={pWordCount} difficulty={difficulty}/>
            <Oxygen oxygen={oxygen} boss={boss}/>

            <div className={classes.depth} style={ boss > 0 ? {color:"maroon"} : {}}>
                <h1>{`${depth >= 100 ? Math.floor(depth/8) : 0}m`}</h1>
            </div>

            <div className={classes.center}>
                {
                    effects.map((effect)=>{
                        return(<Effect word={effect.word} avatar={effect.avatar} username={effect.username} oxadd={effect.oxadd}/>)
                    })
                }
                
                
                <div style={{display:"flex", justifyContent:"center", alignItems: "center"}}>
                    <div className={classes.submarine}>
                        <div className={classes.playersWrapper}>
                            <div className={classes.players}><img src={avatars[joinedPlayers[3]?.avatar] || placeholder}/></div>
                            <div className={classes.players}><img src={avatars[joinedPlayers[2]?.avatar] || placeholder}/></div>
                            <div className={classes.players}><img src={avatars[joinedPlayers[1]?.avatar] || placeholder}/></div>
                            <div className={classes.players}><img src={avatars[joinedPlayers[0]?.avatar] || placeholder}/></div>
                        </div>
                        <img src={submarine}/>
                    </div>
                    
                </div>
                
            </div>
          
            

            <div className={classes.map} style={{ top: `-${depth}px`}}>
                <div className={classes.water1}></div>
                <div className={classes.water2}></div>
                <div className={classes.water3}></div>
                <div className={classes.water4}></div>
            </div>
            <Boss boss={boss} setBoss={setBoss} bossMusic={bossMusic}/>
            <Tiles setEffects={setEffects} setBoss={setBoss} boss={boss} over={over} setOver={setOver} difficulty={difficulty} setInteract={setInteract} interact={interact}/>
        </div>
    )
}