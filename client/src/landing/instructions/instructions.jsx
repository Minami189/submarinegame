import classes from "./instructions.module.css";

export default function Instructions({openInstructions, setOpenInstructions}){

    if(!openInstructions) return null;
    return(
        <div className={classes.wrapper}>
            <div onClick={()=>{setOpenInstructions(false)}} style={{position:"absolute", height:"100vh", width:"100vw"}}/>
                <div className={classes.instructionsBody}>
                    <div className={classes.left}>
                        <h1>Gameplay</h1>

                        <h2>Oxygen</h2>
                        <ul>
                            <li>for every word a player inputs you get a random amount of O2</li>
                            <li>if your O2 ever reaches zero, you lose</li>
                        </ul>

                        <h2>Words</h2>
                        <ul>
                            <li>if someone has already input a word before, you can no longer use it again</li>
                            <li>the game's difficulty setting determines the range of allowed word lengths</li>
                        </ul>

                        <h2>Bosses</h2>
                        <ul>
                            <li>If you have encountered a boss your oxygen and tiles will change color</li>
                            <li>During this, you cannot gain oxygen until you kill the boss</li>
                            <li>You can kill the boss by typing in a certain amount of words</li>
                        </ul>
                        
                    </div>
                    <div className={classes.right}>
                        <h2 style={{marginTop:"35px"}}>Tiles</h2>
                        <ul>
                            <li>yellow tiles means you don't need to fill them up</li>
                            <li>green tiles means you require to fill them up for the word to be accepted</li>
                        </ul>


                        <h1 style={{marginBottom: "30px"}}>Crews</h1>

                        <h2>Create</h2>
                        <ul>
                            <li>When creating a crew, you can invite your friends using the code generated seen at the topleft corner</li>
                        </ul>

                        <h2>Join</h2>
                        <ul>
                            <li>You can join your friends using their generated code seen at the topleft corner</li>
                        </ul>

                        
   
                    </div>
                </div>
        </div>
    )
}