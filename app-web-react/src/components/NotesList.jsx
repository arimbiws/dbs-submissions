import React from 'react';
import NoteItem from './NoteItem';

function NotesList({ notes, onDelete, onArchive, searchKeyword, dataTestId = 'notes-list' }) {
  const hasNotes = notes.length > 0;
  if (!hasNotes) {
    return (
      <div className="notes-list notes-list--empty" data-testid={dataTestId}>
        <p className="notes-list__empty-message" data-testid={`${dataTestId}-empty`}>
          Tidak ada catatan
        </p>
      </div>
    );
  }

  const groupedNotes = notes.reduce((acc, note) => {
    const date = new Date(note.createdAt);
    const groupKey = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(note);
    return acc;
  }, {});

  return (
    <div className="notes-list notes-list--grouped" data-testid={dataTestId}>
      {Object.entries(groupedNotes).map(([groupKey, groupNotes]) => (
        <section key={groupKey} className="notes-group" data-testid={`${groupKey}-group`}>
          <div className="notes-group__header">
            <h3 className="notes-group__title">{groupKey}</h3>
            <span className="notes-group__count" data-testid={`${groupKey}-group-count`}>
              {groupNotes.length} catatan
            </span>
          </div>
          <div className="notes-group__items">
            {groupNotes.map((note) => (
              <NoteItem key={note.id} note={note} onDelete={onDelete} onArchive={onArchive} searchKeyword={searchKeyword} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default NotesList;
