import React from 'react';
import { ModalProps } from '../../../constants';

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

export default Modal