
type input = {
  [key: number]: string;
};


export interface ClientToServerEvents {
  broadcastClick : (res:{input:input, turn:string}) => void;
  broadcast_winEvent : (res:{winner: string}) => void;
  broadcast_resetEvent : ()=>void
  test : (res:{msg:string}) => void,
  broadcast_socketToRoom_connected : (res:{msg:string, user_id:number})=>void
  broadcast_user_overflow : ()=>void
}


//Client to server side.
export interface ServerToClientEvents {
  join_room_Event : (req : {roomNumber:number}) => void
  win_Event : (req:{winner:string, callback : ()=>void})=>void;
  clicked: (req:{input:input, turn:string}) => void;
  reset_Event : (req:input)=>void;
}




