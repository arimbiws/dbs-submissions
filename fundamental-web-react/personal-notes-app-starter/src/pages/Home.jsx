import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import NoteList from "../components/NoteList";
import NoteSearch from "../components/NoteSearch";
import { getActiveNotes } from "../utils/local-data";
import { FiPlus } from "react-icons/fi";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const notes = getActiveNotes();
  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(keyword.toLowerCase()));

  const onKeywordChangeHandler = (keyword) => {
    setSearchParams({ keyword });
  };

  return (
    <section className="homepage">
      <h2>Catatan Aktif</h2>
      <NoteSearch keyword={keyword} keywordChange={onKeywordChangeHandler} />
      <NoteList notes={filteredNotes} emptyMessage="Tidak ada catatan aktif" />
      <div className="homepage__action">
        <Link to="/notes/new" className="action" title="Tambah">
          <FiPlus />
        </Link>
      </div>
    </section>
  );
}

export default Home;
