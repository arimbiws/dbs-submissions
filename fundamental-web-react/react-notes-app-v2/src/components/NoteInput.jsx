import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { FiCheck } from "react-icons/fi";
import { LocaleContext } from "../contexts/LocaleContext";

function NoteInput({ addNote }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { locale } = useContext(LocaleContext);

  const onTitleChangeEventHandler = (event) => {
    setTitle(event.target.value);
  };

  const onBodyInputEventHandler = (event) => {
    setBody(event.target.innerHTML);
  };

  const onPasteEventHandler = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const onSubmitEventHandler = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      alert(locale === "id" ? "Judul tidak boleh kosong!" : "Title cannot be empty!");
      return;
    }

    const plainTextBody = body.replace(/(<([^>]+)>)/gi, "").trim();
    if (plainTextBody === "") {
      alert(locale === "id" ? "Isi catatan tidak boleh kosong!" : "Note body cannot be empty!");
      return;
    }

    addNote({ title, body });
  };

  return (
    <form className="add-new-page__input" onSubmit={onSubmitEventHandler}>
      <input type="text" className="add-new-page__input__title" placeholder={locale === "id" ? "Catatan baru..." : "New notes..."} value={title} onChange={onTitleChangeEventHandler} required />
      <div className="add-new-page__input__body" data-placeholder={locale === "id" ? "Sebenarnya saya adalah ...." : "Actually I am ..."} contentEditable onInput={onBodyInputEventHandler} onPaste={onPasteEventHandler} />
      <div className="add-new-page__action">
        <button className="action" type="submit" title={locale === "id" ? "Simpan" : "Save"}>
          <FiCheck />
        </button>
      </div>
    </form>
  );
}

NoteInput.propTypes = {
  addNote: PropTypes.func.isRequired,
};

export default NoteInput;
