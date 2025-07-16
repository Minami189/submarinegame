import classes from "./oxygen.module.css";


export default function Oxygen({oxygen}){
    return(
        <div className={classes.border}>
            <div className={classes.fill} style={{height:`${oxygen}%`}}/>

            <div style={{display:"flex", flexDirection: "column", height:"100%", alignItems: "center", width: "100%"}}>
                <div className={classes.o2text}>
                    <h1>O2</h1>
                    <h4>{`${Math.round(oxygen)}%`}</h4>
                </div>
            </div>
                
 

        </div>
    )
}