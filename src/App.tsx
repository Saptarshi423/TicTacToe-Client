import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { io, Socket } from 'socket.io-client';
//import { ClientToServerEvents, ServerToClientEvents } from '../constants';


// //Server to client side.
interface ClientToServerEvents {
  broadcastClick : (res:{input:input, turn:string}) => void;
  broadcast_winEvent : (res:{winner: string}) => void;
  broadcast_resetEvent : (res:input)=>void
}


//Client to server side.
interface ServerToClientEvents {
  win_Event : (req:{winner:string})=>void;
  reset_Event : (req:input)=>void;
  clicked: (req:{input:input, turn:string}) => void;
}


const socket : Socket<ClientToServerEvents, ServerToClientEvents> = io("ws://localhost:5050");


type input = {
  [key: number]: string;
};


const initialState : input = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
}

const wins: number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function App() {

  const [input, setInput] = useState<input>(initialState);

  const [turn, setTurn] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null); 

  //const socket = io("ws://localhost:5050")


  // Look for a winner.
  const CheckWin = ():void=>{

    const EmptyValue = (win:any) : boolean=>{
      if((input[win[0]] == input[win[1]]) && (input[win[1]] == input[win[2]])) return input[win[0]].length === 0 ? false : true;
      return false;
    }


    wins.forEach((win : number[]) : void=>{
      if((input[win[0]] == input[win[1]]) && (input[win[1]]== input[win[2]]) && EmptyValue(win)){
        setWinner(input[win[0]]);

        //Create a req object to send.
        let req_obj : {winner: string} = {
          winner: input[win[0]],
        }
        socket.emit("win_Event", req_obj);
        //return;
      }
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined = undefined): void => {
    const id = Number((e?.target as HTMLDivElement).id);

    //update the input value.
    input[id] = turn;

    //update the turn
    setTurn((prev: string): string => {
      if (prev === "X") return "O";
      return "X"
    })

    let req :{input:input, turn : string} = {
      input,
      turn,
    }

    socket.emit("clicked", req);

    // Look if someone won the game.
    CheckWin();
  }


  const handleReset = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) : void =>{
    console.log("restting.")
    setInput({...initialState})
    setTurn("X");
    setWinner(null);
    socket.emit("reset_Event", initialState);
  }


  const handleBroadCastClick = (res : any)=>{
    let {input, turn} = res;
    setInput({...input});
    setTurn(turn)
  }

  const handleBroadcastWin = (res:{winner:string})=>{
    setWinner(res.winner);
    setTurn("X");
  }

  const handleBroadcasReset = (res:input)=>{
    setInput({...res});
    setTurn("X");
    setWinner(null);
  }

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected...")
    });

    socket.on("broadcastClick", handleBroadCastClick);
    socket.on("broadcast_winEvent", handleBroadcastWin)
    socket.on("broadcast_resetEvent", handleBroadcasReset)

    return ()=>{
      socket.off("broadcastClick", handleBroadCastClick)
    }
  },[])


  return (
    <div className="App">
      <div className='btn-container'>
        <p className='winner'>{winner ? `${winner} wins!!` : "   "}</p>
        <div className='btn-wrapper'>
          <button className='btn' onClick={handleReset}>RESET</button>
        </div>
      </div>
      <div className='container'>
        <div className='box' id="0" onClick={handleClick}>{input[0]}</div>
        <div className='box' id="1" onClick={handleClick}>{input[1]}</div>
        <div className='box' id="2" onClick={handleClick}>{input[2]}</div>
        <div className='box' id="3" onClick={handleClick}>{input[3]}</div>
        <div className='box' id="4" onClick={handleClick}>{input[4]}</div>
        <div className='box' id="5" onClick={handleClick}>{input[5]}</div>
        <div className='box' id="6" onClick={handleClick}>{input[6]}</div>
        <div className='box' id="7" onClick={handleClick}>{input[7]}</div>
        <div className='box' id="8" onClick={handleClick}>{input[8]}</div>
      </div>
    </div>
  );
}

export default App;
