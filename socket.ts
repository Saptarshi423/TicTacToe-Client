import React from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './constants';

const socket : Socket<ClientToServerEvents, ServerToClientEvents> = io("ws://localhost:5050")

export {socket};