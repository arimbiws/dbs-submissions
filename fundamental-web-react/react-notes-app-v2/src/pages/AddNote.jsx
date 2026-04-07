import React, { useContext } from "react";
import { LocaleContext } from "../contexts/LocaleContext";
import { useNavigate, Link } from "react-router-dom";
import NoteInput from "../components/NoteInput";
import { addNote } from "../utils/network-data";
import { FiArrowLeft } from "react-icons/fi";

function AddNote() {
  const navigate = useNavigate();
  const { locale } = useContext(LocaleContext);

  const onAddNoteHandler = async (note) => {
    await addNote(note);
    navigate("/");
  };

  return (
    <>
      <div className="detail-page__back">
        <Link to="/" title={locale === "id" ? "Kembali" : "Back"}>
          <FiArrowLeft /> {locale === "id" ? "Batal" : "Back"}
        </Link>
      </div>

      <section className="add-new-page">
        <NoteInput addNote={onAddNoteHandler} />
      </section>
    </>
  );
}

export default AddNote;
