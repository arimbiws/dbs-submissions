import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import NoteList from "../components/NoteList";
import NoteSearch from "../components/NoteSearch";
import { getArchivedNotes } from "../utils/network-data";
import { LocaleContext } from "../contexts/LocaleContext";

function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useContext(LocaleContext);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await getArchivedNotes();
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
    <section className="archive-page">
      <h2>{locale === "id" ? "Catatan Arsip" : "Archived Notes"}</h2>
      <NoteSearch keyword={keyword} keywordChange={onKeywordChangeHandler} />
      {loading ? <p className="loading-indicator">{locale === "id" ? "Memuat data..." : "Loading data..."}</p> : <NoteList notes={filteredNotes} emptyMessage={locale === "id" ? "Arsip kosong" : "Archive is empty"} />}
    </section>
  );
}

export default Archive;
