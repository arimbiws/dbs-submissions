import React from 'react';
import { showFormattedDate } from '../utils';
import NoteActionButton from './NoteActionButton';

function NoteItem({ note, onDelete, onArchive, searchKeyword }) {
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return <>{parts.map((part, index) => (part.toLowerCase() === keyword.toLowerCase() ? <mark key={index}>{part}</mark> : part))}</>;
  };

  return (
    <div className="note-item" data-testid="note-item" data-note-id={note?.id}>
      <div className="note-item__content" data-testid="note-item-content">
        <h3 className="note-item__title" data-testid="note-item-title">
          {highlightText(note.title, searchKeyword)}
        </h3>
        <p className="note-item__date" data-testid="note-item-date">
          {showFormattedDate(note.createdAt)}
        </p>
        <p className="note-item__body" data-testid="note-item-body">
          {highlightText(note.body, searchKeyword)}
        </p>
      </div>
      <div className="note-item__action" data-testid="note-item-action">
        <NoteActionButton
          variant="delete"
          onClick={() => {
            const isConfirm = window.confirm(`Apakah Anda yakin ingin menghapus catatan "${note.title}"?`);
            if (isConfirm) {
              onDelete(note.id);
            }
          }}
          text="Hapus"
          dataTestId="note-item-delete-button"
        />

        <NoteActionButton variant="archive" onClick={() => onArchive(note.id)} text={note.archived ? 'Pindahkan' : 'Arsipkan'} dataTestId="note-item-archive-button" />
      </div>
    </div>
  );
}

export default NoteItem;
