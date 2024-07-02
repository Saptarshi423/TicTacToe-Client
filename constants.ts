
type input = {
  [key: number]: string;
};


export interface ClientToServerEvents {
  broadcastClick : (res:{input:input, turn:string}) => void;
  broadcast_winEvent : (res:{winner: string}) => void;
  broadcast_resetEvent : ()=>void
}


//Client to server side.
export interface ServerToClientEvents {
  win_Event : (req:{winner:string})=>void;
  reset_Event : ()=>void;
  clicked: (req:{input:input, turn:string}) => void;
}




