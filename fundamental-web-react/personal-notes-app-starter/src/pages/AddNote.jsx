import React from "react";
import { useNavigate, Link } from "react-router-dom";
import NoteInput from "../components/NoteInput";
import { addNote } from "../utils/local-data";
import { FiArrowLeft } from "react-icons/fi";

function AddNote() {
  const navigate = useNavigate();

  const onAddNoteHandler = (note) => {
    addNote(note);
    navigate("/");
  };

  return (
    <>
      <div className="detail-page__back">
        <Link to="/" title="Kembali">
          <FiArrowLeft /> Batal
        </Link>
      </div>
      <section className="add-new-page">
        <NoteInput addNote={onAddNoteHandler} />
      </section>
    </>
  );
}

export default AddNote;
