import React from 'react';

function NoteActionButton({ variant, onClick, text, dataTestId }) {
  return (
    <button className={`note-item__${variant}-button`} type="button" onClick={onClick} data-testid={dataTestId}>
      {text}
    </button>
  );
}

export default NoteActionButton;
