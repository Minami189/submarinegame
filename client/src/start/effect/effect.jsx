import classes from "./effect.module.css"
import { useEffect, useContext } from "react"
import { AppContext } from "../../App";
export default function Effect({word, username, avatar}){
    const {avatars} = useContext(AppContext);

    return(
        <div className={classes.effectWrapper}>
            <img src={avatars[avatar]}/>
            <div className={classes.content}>
                <h5>{username}</h5>
                <h1>{word}</h1>
            </div>
        </div>
    )
}