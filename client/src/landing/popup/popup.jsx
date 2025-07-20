import classes from "./popup.module.css";
import left from "../../assets/left.png";
import right from "../../assets/right.png";
import { useEffect, useRef, useContext, useState } from "react";
import { AppContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import bubbles from "../../assets/bubbles.mp3";

export default function Popoup({ showPopup, setShowPopup, setState, loading, setLoading }) {
    const { socket, av, setAv, avatars } = useContext(AppContext);
    const [username, setUsername] = useState("");
    

    useEffect(() => {   
        socket.on("login", (data) => {
            localStorage.clear();
            localStorage.setItem("instanceToken", data.instanceToken);
            setShowPopup(false);
            setState("crew");
            console.log(data.instanceToken);
        });

        if (localStorage.getItem("instanceToken")) {
            const decoded = jwtDecode(localStorage.getItem("instanceToken"));
            setAv(decoded.avatar);
            setUsername(decoded.username);
        }

        return () => {
            socket.off("login");
        };
    }, []);

    const uiClick = new Audio(bubbles);

    function handleLeft() {
        if (av > 0) {
            setAv((prev) => prev - 1);
            uiClick.play();
        }
    }

    function handleRight() {
        if (av < avatars.length - 1) {
            setAv((prev) => prev + 1);
            uiClick.play();
        }
    }

    function handleConfirm() {
        if (username.trim() === "") {
            alert("must input username");
            return;
        }
        uiClick.play();
        let instanceID;
        const token = localStorage.getItem("instanceToken")
        if(token){
            const decoded = jwtDecode(token);
            instanceID = decoded.instanceID;
            console.log("instance ID editing " + instanceID);
        }

        socket.emit("create_user", { avatar: av, username: username.trim(), instanceID: instanceID});
        setLoading(true);
    }

    if (!showPopup) return null;

    return (
        <div className={classes.backdrop}>
            <div className={classes.backdrop} style={loading ?  {display:"flex"} : {display:"none"}}>
                <div className={classes.loading}>
                    <h1>Loading...</h1>
                    <h1>The server is slow at this time</h1>
                    <h2>Try refreshing later</h2>
                </div>
                
            </div>
            <div onClick={() => setShowPopup(false)} style={{ position: "absolute", height: "100%", width: "100%", zIndex: -1 }} />
            <div className={classes.popupBody}>
                <div className={classes.avatarWrapper}>
                    <img src={left} onClick={handleLeft} className={classes.uiImage} />
                    <img src={avatars[av]} className={classes.avatarImage} />
                    <img src={right} onClick={handleRight} className={classes.uiImage} />
                </div>
                <input maxLength={15} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username"/>
                <button onClick={handleConfirm} className={classes.whiteButton}>Confirm</button>
            </div>
        </div>
    );
}
