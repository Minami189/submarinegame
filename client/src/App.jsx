import { useState, useEffect, createContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import "./App.css"
import io from "socket.io-client";
import Landing from "./landing/landing.jsx";
import Start from "./start/start.jsx";
const socket = io.connect(import.meta.env.VITE_BACKEND_URL);
export const AppContext = createContext();

import av1 from "./assets/av1.png";
import av2 from "./assets/av2.png";
import av3 from "./assets/av3.png";

function App() {
  const [state, setState] = useState("username");
  const [av, setAv] = useState(0);
  const avatars = [av1,av2,av3]; 
  //states:
    //username - play button to input username
    //crew - joining and creating crew
    //lobby - when in a crew already
    //start - when game has started
    

  return (
    <AppContext.Provider value={{socket, state, setState, av, setAv, avatars}}>
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
