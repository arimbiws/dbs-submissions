import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiCheck } from "react-icons/fi";

function NoteInput({ addNote }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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
      alert("Judul catatan tidak boleh kosong!");
      return;
    }

    const plainTextBody = body.replace(/(<([^>]+)>)/gi, "").trim();
    if (plainTextBody === "") {
      alert("Isi catatan tidak boleh kosong!");
      return;
    }

    addNote({ title, body });
  };

  return (
    <form className="add-new-page__input" onSubmit={onSubmitEventHandler}>
      <input type="text" className="add-new-page__input__title" placeholder="Catatan baru" value={title} onChange={onTitleChangeEventHandler} required />
      <div className="add-new-page__input__body" data-placeholder="Sebenarnya saya adalah ...." contentEditable onInput={onBodyInputEventHandler} onPaste={onPasteEventHandler} />
      <div className="add-new-page__action">
        <button className="action" type="submit" title="Simpan">
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
