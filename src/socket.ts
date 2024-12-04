import React from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../constants';

const URL : any = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_BACKEND_PRODUCTION : process.env.REACT_APP_BACKEND_DEV;
const socket: Socket<ClientToServerEvents, ServerToClientEvents> = io(URL);

export {socket, URL};