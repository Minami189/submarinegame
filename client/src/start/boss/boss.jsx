import classes from "./boss.module.css";
import shark from "../../assets/Shark.png"
import squid from "../../assets/Squid.png"
import angler from "../../assets/Angler.png"
import { useEffect } from "react";
import { AppContext } from "../../App";
import { useContext, useState } from "react";
import thud from "../../assets/thud.mp3";
import DamageEff from "./damageEff/damageeff";


const damageBoss = new Audio(thud);


export default function Boss({boss, setBoss, bossMusic}){
    const [damage, setDamage] = useState(false);
    const [death, setDeath] = useState(false);
    const {socket} = useContext(AppContext);
    const [eff, setEff] = useState([]);
    const bosses = [shark, squid, angler];
    bossMusic.volume = 0.2;

    useEffect(()=>{
        socket.on("damage_boss", (data)=>{
            setEff(prev=>prev.concat({username:data.username, avatar:data.avatar, word:data.word}));
            setDamage(true);
            
            damageBoss.currentTime = 0;
            damageBoss.play();
            
            setTimeout(()=>{
                setDamage(false);
            }, 300)
        })

        socket.on("kill_boss", ()=>{
            setDeath(true);
            setTimeout(()=>{
                setDeath(false);
                setBoss(0);
            }, 2000)
            bossMusic.currentTime = 0;
            bossMusic.loop = false;
            bossMusic.pause();
        })

    }, [])
    if(boss < 1) return null;

    return(
        <div className={classes.bossBody}>
            <div className={death ? classes.death : classes.bossWrapper}>
                <div className={damage ? classes.bossDamage : null}>
                    <img src={bosses[boss-1]}/>
                </div>
                {
                    eff.map((eff)=>{
                        return(<DamageEff word={eff.word} username={eff.username} avatar={eff.avatar}/>)
                    })
                }
            </div>
        </div>
    )
}