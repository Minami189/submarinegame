import { useState, useEffect, createContext } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import "./App.css"
import io from "socket.io-client";
import Landing from "./landing/landing.jsx";
import Start from "./start/start.jsx";
const socket = io.connect(import.meta.env.VITE_API_URL);
export const AppContext = createContext();

import av1 from "./assets/av1.png";
import av2 from "./assets/av2.png";
import av3 from "./assets/av3.png";
import av4 from "./assets/av4.png";
import av5 from "./assets/av5.png";
import av6 from "./assets/av6.png";
import av7 from "./assets/av7.png";
import av8 from "./assets/av8.png";
import av9 from "./assets/av9.png";
import av10 from "./assets/av10.png";
import ambiance from "./assets/ambiance.mp3";

function App() {
  const [state, setState] = useState("username");
  const [av, setAv] = useState(0);
  const [difficulty, setDifficulty] = useState();
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const avatars = [av1,av2,av3,av4,av5,av6,av7,av8,av9,av10];
  const ambianceAudio = new Audio(ambiance);
  ambianceAudio.pause();
  ambianceAudio.currentTime = 0;
  ambianceAudio.loop = false;
  //states:
    //username - play button to input username
    //crew - joining and creating crew
    //lobby - when in a crew already
    //start - when game has started
  useEffect(()=>{
    if(joinedPlayers.length > 0){
      setJoinedPlayers([]);
    }
  },[])
  return (
    <AppContext.Provider value={{socket, state, setState, av, setAv, avatars, difficulty, setDifficulty, joinedPlayers, setJoinedPlayers, ambianceAudio}}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing/>}/>
          <Route path="/start" element={<Start/>}/>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
