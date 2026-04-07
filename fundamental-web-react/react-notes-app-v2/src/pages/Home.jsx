import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import NoteList from "../components/NoteList";
import NoteSearch from "../components/NoteSearch";
import { getActiveNotes } from "../utils/network-data";
import { LocaleContext } from "../contexts/LocaleContext";
import { FiPlus } from "react-icons/fi";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useContext(LocaleContext);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await getActiveNotes();
      setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const onKeywordChangeHandler = (keyword) => {
    setSearchParams({ keyword });
  };

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <section className="homepage">
      <h2>{locale === "id" ? "Catatan Aktif" : "Active Notes"}</h2>
      <NoteSearch keyword={keyword} keywordChange={onKeywordChangeHandler} />

      {loading ? <p className="loading-indicator">{locale === "id" ? "Memuat data..." : "Loading data..."}</p> : <NoteList notes={filteredNotes} emptyMessage={locale === "id" ? "Tidak ada catatan aktif" : "No active notes"} />}

      <div className="homepage__action">
        <Link to="/notes/new" className="action" title="Tambah">
          <FiPlus />
        </Link>
      </div>
    </section>
  );
}

export default Home;
