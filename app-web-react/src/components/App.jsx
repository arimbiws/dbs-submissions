import React from 'react';
import { getInitialData } from '../utils';
import NoteInput from './NoteInput';
import NotesList from './NotesList';
import Navbar from './Navbar';
import Footer from './Footer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: getInitialData(),

      searchKeyword: '',
    };

    this.onAddNoteHandler = this.onAddNoteHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onSearchHandler = this.onSearchHandler.bind(this);
  }

  onAddNoteHandler({ title, body }) {
    this.setState((prevState) => ({
      notes: [
        ...prevState.notes,

        {
          id: +new Date(),
          title,
          body,
          createdAt: new Date().toISOString(),
          archived: false,
        },
      ],
    }));
  }

  onDeleteHandler(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.filter((note) => note.id !== id),
    }));
  }

  onArchiveHandler(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.map((note) => (note.id === id ? { ...note, archived: !note.archived } : note)),
    }));
  }

  onSearchHandler(keyword) {
    this.setState({ searchKeyword: keyword });
  }

  render() {
    const { notes, searchKeyword } = this.state;

    const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchKeyword.toLowerCase()) || note.body.toLowerCase().includes(searchKeyword.toLowerCase()));
    const sortedNotes = filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const activeNotes = sortedNotes.filter((note) => !note.archived);
    const archivedNotes = sortedNotes.filter((note) => note.archived);

    return (
      <div className="note-app" data-testid="note-app">
        <Navbar searchKeyword={searchKeyword} onSearchChange={this.onSearchHandler} />

        <main className="note-app__body" data-testid="note-app-body">
          <NoteInput addNote={this.onAddNoteHandler} />

          <section aria-labelledby="active-notes-title" data-testid="active-notes-section">
            <h2 id="active-notes-title">Catatan Aktif ({activeNotes.length})</h2>
            <NotesList notes={activeNotes} onDelete={this.onDeleteHandler} onArchive={this.onArchiveHandler} dataTestId="active-notes-list" searchKeyword={searchKeyword} />
          </section>

          <section aria-labelledby="archived-notes-title" data-testid="archived-notes-section">
            <h2 id="archived-notes-title">Arsip ({archivedNotes.length})</h2>
            <NotesList notes={archivedNotes} onDelete={this.onDeleteHandler} onArchive={this.onArchiveHandler} dataTestId="archived-notes-list" searchKeyword={searchKeyword} />
          </section>
        </main>

        <Footer />
      </div>
    );
  }
}

export default App;
