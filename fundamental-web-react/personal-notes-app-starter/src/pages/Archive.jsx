import React from "react";
import { useSearchParams } from "react-router-dom";
import NoteList from "../components/NoteList";
import NoteSearch from "../components/NoteSearch";
import { getArchivedNotes } from "../utils/local-data";

function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const notes = getArchivedNotes();
  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(keyword.toLowerCase()));

  const onKeywordChangeHandler = (keyword) => {
    setSearchParams({ keyword });
  };

  return (
    <section className="archive-page">
      <h2>Catatan Arsip</h2>
      <NoteSearch keyword={keyword} keywordChange={onKeywordChangeHandler} />
      <NoteList notes={filteredNotes} emptyMessage="Arsip kosong" />
    </section>
  );
}

export default Archive;
