import React from 'react';
import NoteSearch from './NoteSearch';

function Navbar({ searchKeyword, onSearchChange }) {
  return (
    <header className="note-app__header navbar" data-testid="note-app-header">
      <div className="note-app__logo">
        <img src="/logo.png" alt="Note Tracker Logo" width="40" height="40" />
        <h1>Note Tracker</h1>
      </div>
      <div className="navbar__search">
        <NoteSearch searchKeyword={searchKeyword} onSearchChange={onSearchChange} />
      </div>
    </header>
  );
}

export default Navbar;
