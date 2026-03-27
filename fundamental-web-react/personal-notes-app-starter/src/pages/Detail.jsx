import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import parser from "html-react-parser";
import { getNote, deleteNote, archiveNote, unarchiveNote } from "../utils/local-data";
import { showFormattedDate } from "../utils/index";
import NotFound from "./NotFound";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = getNote(id);

  if (!note) {
    return <NotFound />;
  }

  const onDeleteHandler = () => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus catatan ini?");

    if (isConfirm) {
      deleteNote(id);
      navigate("/");
    }
  };

  const onArchiveHandler = () => {
    if (note.archived) {
      unarchiveNote(id);
      navigate("/archives");
    } else {
      archiveNote(id);
      navigate("/");
    }
  };

  return (
    <>
      <div className="detail-page__back">
        <Link to="/" title="Kembali">
          <FiArrowLeft /> Kembali
        </Link>
      </div>
      <section className="detail-page">
        <h3 className="detail-page__title">{note.title}</h3>
        <p className="detail-page__createdAt">{showFormattedDate(note.createdAt)}</p>
        <div className="detail-page__body">{parser(note.body)}</div>

        <div className="detail-page__action">
          <button className="action" onClick={onArchiveHandler} title={note.archived ? "Batal Arsip" : "Arsipkan"}>
            {note.archived ? <BiArchiveOut /> : <BiArchiveIn />}
          </button>
          <button className="action" onClick={onDeleteHandler} title="Hapus">
            <FiTrash2 />
          </button>
        </div>
      </section>
    </>
  );
}

export default Detail;
