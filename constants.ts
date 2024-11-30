export type value = {
  val: string;
  color: any;
};

export type input = {
  [key: number]: value;
};

export interface ClientToServerEvents {
  broadcastClick: (res: { input: input; turn: string }) => void;
  broadcast_winEvent: (res: { winner: string }) => void;
  broadcast_resetEvent: () => void;
  test: (res: { msg: string; color: string }) => void;
  broadcast_socketToRoom_connected: (res: {
    msg: string;
    user_id: number;
  }) => void;
  broadcast_user_overflow: () => void;
  client_disconnected_Event: (res: { msg: string }) => void;
}

//Client to server side.
export interface ServerToClientEvents {
  join_room_Event: (req: { roomNumber: number }) => void;
  win_Event: (req: { winner: string; callback: () => void }) => void;
  clicked: (req: { input: input; turn: string }) => void;
  reset_Event: (req: input) => void;
}

export interface ModalProps {
  winner: string | null;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  msg: string | null;
  reset: () => void;
}

export interface ProtectedRouteType {
  isAuthenticated: boolean;
  loggedIn : boolean | undefined,
  children: JSX.Element;
}

export interface FormInputProps {
  isLogin: boolean;
}

export interface firebase {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export type changeEvent = React.ChangeEvent<HTMLInputElement>;
