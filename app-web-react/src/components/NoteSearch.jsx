import React from 'react';

function NoteSearch({ searchKeyword, onSearchChange }) {
  return (
    <div className="note-search" data-testid="note-search">
      <input type="text" placeholder="Cari catatan..." value={searchKeyword} onChange={(event) => onSearchChange(event.target.value)} data-testid="note-search-input" />
    </div>
  );
}

export default NoteSearch;
