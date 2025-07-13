import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000")

function App() {
  
  useEffect(()=>{
    socket.on("reping", ()=>{
      console.log("got from backend")
    })
  }, [])
  return (
    <>
      <button onClick={()=>socket.emit("ping")}>
        Ping
      </button>
    </>
  )
}

export default App
