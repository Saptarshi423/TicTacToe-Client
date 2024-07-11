import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents, ModalProps } from '../constants';
import {socket} from './socket';

type value = {
  val: string,
  color: any,
}

type input = {
  [key: number]: value;
};

const initialState: input | {} = {
  0: { val: "", color: "red" },
  1: { val: "", color: "red" },
  2: { val: "", color: "red" },
  3: { val: "", color: "red" },
  4: { val: "", color: "red" },
  5: { val: "", color: "red" },
  6: { val: "", color: "red" },
  7: { val: "", color: "red" },
  8: { val: "", color: "red" },
}

const wins: number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function App() {

  const [input, setInput] = useState<input>(initialState);

  const [turn, setTurn] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState<number | undefined>(undefined);
  const [color, setColor] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null)

  // Look for a winner.
  const CheckWin = (): void => {

    const EmptyValue = (win: any): boolean => {
      if ((input[win[0]].val == input[win[1]].val) && (input[win[1]].val == input[win[2]].val))
        return input[win[0]].val.length === 0 ? false : true;
      return false;
    }


    wins.forEach((win: number[]): void => {
      if ((input[win[0]].val == input[win[1]].val) && (input[win[1]].val === input[win[2]].val) && EmptyValue(win)) {
        setWinner(input[win[0]].val);

        //Create a req object to send.
        let req_obj: { winner: string, callback: () => void } = {
          winner: input[win[0]].val,
          callback: () => { console.log("hello") }
        }
        socket.emit("win_Event", req_obj);
        console.log("WINNER", req_obj.winner)
        //return;
      }
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined = undefined): void => {
    const id = Number((e?.target as HTMLDivElement).id);
    if (input[id].val !== "") {
      return;
    }

    //update the input value.
    input[id].val = turn;

    //update the input color
    input[id].color = color ?? "red";

    //update the turn
    setTurn((prev: string): string => {
      if (prev === "X") return "O";
      return "X"
    })

    let req: { input: input, turn: string } = {
      input,
      turn,
    }

    socket.emit("clicked", req);

    // Look if someone won the game.
    CheckWin();
  }

  // reset function
  const reset = () => {
    setInput((prev: input) => {
      let newState: input = {};
      Object.keys(prev).forEach((val) => {
        newState[Number(val)] = { val: "", color: "" };
      });

      return newState
    })
  }

  // on reset click
  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    reset();
    setTurn("X");
    setWinner(null);
    socket.emit("reset_Event", initialState);
  }

  // broadcast click
  const handleBroadCastClick = (res: any) => {
    console.log(res)
    let { inputState, turn } = res;
    setInput({ ...inputState });
    setTurn(turn)
  }

  // win event
  const handleBroadcastWin = (res: { winner: string }) => {
    console.log(winner)
    setWinner(res.winner);
    setTurn("X");
    setShowModal(true);
  }

  // reset event
  const handleBroadcasReset = () => {
    reset();
    setTurn("X");
    setWinner(null);
  }


  // join a selected room.
  const joinRoom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomToJoin = Number((e.target as HTMLSelectElement).value);
    setRoomNumber(roomToJoin);
    console.log(roomToJoin)
    socket.emit("join_room_Event", { roomNumber: roomToJoin })
  }

  // get the color
  const broadcastHello = (res: { msg: string, color: string }) => {
    console.log(res.msg, res.color);
    setColor(res.color);
  }

  // On other web client joining
  const broadCastSocketToRoomConnected = (res: { msg: string, user_id: number }) => {
    console.log(res)
    console.log("User " + res.user_id + " joined.")
  }

  // User > 2
  const handleUserOverFlow = () => {
    setShowModal(true);
    setMsg("Can't connect to the given room as it is occupied.")
  }

  const handleClientDisconnect = (res: { msg: string }) => {
    setShowModal(true);
    setMsg(res.msg);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected...")
    });

    socket.on("broadcastClick", handleBroadCastClick);
    socket.on("broadcast_winEvent", handleBroadcastWin)
    socket.on("broadcast_resetEvent", handleBroadcasReset);
    socket.on("test", broadcastHello);
    socket.on("broadcast_socketToRoom_connected", broadCastSocketToRoomConnected);
    socket.on("broadcast_user_overflow", handleUserOverFlow);
    socket.on("client_disconnected_Event", handleClientDisconnect)

    return () => {
      socket.off("broadcastClick", handleBroadCastClick);
      socket.off("broadcast_winEvent", handleBroadcastWin)
      socket.off("broadcast_resetEvent", handleBroadcasReset);
      socket.off("test", broadcastHello);
      socket.off("broadcast_socketToRoom_connected", broadCastSocketToRoomConnected);
      socket.off("broadcast_user_overflow", handleUserOverFlow);
      socket.off("client_disconnected_Event", handleClientDisconnect)
    }
  }, []) // subscribe and unsubscribe on closure.


  return (
    <div className="App">
      <div className='application--wrapper'>

        <div className='btn-container'>
          {/* <button className='leave-btn'>Leave</button> */}
          <h3>Select a room to join...</h3>
          <select onChange={joinRoom}>
            <option value="" disabled selected>---</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          {/* <p className='winner'>{winner ? `${winner} wins!!` : "   "}</p> */}
          <div className='btn-wrapper'>
            <button className='reset-btn' onClick={handleReset}>RESET</button>
          </div>
        </div>
        <div className='container--wrapper'>
          <div className='container'>
            <div className='box' id="0" onClick={handleClick} style={{ color: input[0].color }}>{input[0].val}</div>
            <div className='box' id="1" onClick={handleClick} style={{ color: input[1].color }}>{input[1].val}</div>
            <div className='box' id="2" onClick={handleClick} style={{ color: input[2].color }}>{input[2].val}</div>
            <div className='box' id="3" onClick={handleClick} style={{ color: input[3].color }}>{input[3].val}</div>
            <div className='box' id="4" onClick={handleClick} style={{ color: input[4].color }}>{input[4].val}</div>
            <div className='box' id="5" onClick={handleClick} style={{ color: input[5].color }}>{input[5].val}</div>
            <div className='box' id="6" onClick={handleClick} style={{ color: input[6].color }}>{input[6].val}</div>
            <div className='box' id="7" onClick={handleClick} style={{ color: input[7].color }}>{input[7].val}</div>
            <div className='box' id="8" onClick={handleClick} style={{ color: input[8].color }}>{input[8].val}</div>
          </div>
        </div>

        {showModal && <Modal winner={winner} setShowModal={setShowModal} setWinner={setWinner} msg={msg} reset={reset} />}
      </div>
    </div>
  );
}


const Modal = (props: ModalProps) => {

  const displayMsg = (): string | null => {
    if (props.winner) {
      return "User " + props.winner + " WON !!"
    }
    return props.msg
  }
  return (
    <div className='overlay'>
      <div className='overlay-box'>
        <h1>{displayMsg()}</h1>
        <button onClick={() => {
          props.setShowModal(false);
          props.setWinner(null);
          props.reset();
        }}>OK</button>
      </div>
    </div >
  )
}

export default App;
