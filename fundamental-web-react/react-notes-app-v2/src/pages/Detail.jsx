import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import parser from "html-react-parser";
import { getNote, deleteNote, archiveNote, unarchiveNote } from "../utils/network-data";
import { showFormattedDate } from "../utils/index";
import { LocaleContext } from "../contexts/LocaleContext";
import NotFound from "./NotFound";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { locale } = useContext(LocaleContext);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const { data } = await getNote(id);
      setNote(data);
      setLoading(false);
    };
    fetchNote();
  }, [id]);

  if (loading) return <p className="loading-indicator">{locale === "id" ? "Memuat catatan..." : "Loading note..."}</p>;

  if (!note) return <NotFound />;

  const onDeleteHandler = async () => {
    const isConfirm = window.confirm(locale === "id" ? "Yakin ingin menghapus?" : "Are you sure you want to delete?");
    if (isConfirm) {
      await deleteNote(id);
      navigate("/");
    }
  };

  const onArchiveHandler = async () => {
    if (note.archived) {
      await unarchiveNote(id);
      navigate("/archives");
    } else {
      await archiveNote(id);
      navigate("/");
    }
  };

  return (
    <>
      <div className="detail-page__back">
        <Link to="/" title={locale === "id" ? "Kembali" : "Back"}>
          <FiArrowLeft /> {locale === "id" ? "Kembali" : "Back"}
        </Link>
      </div>
      <section className="detail-page">
        <h3 className="detail-page__title">{note.title}</h3>
        <p className="detail-page__createdAt">{showFormattedDate(note.createdAt, locale)}</p>
        <div className="detail-page__body">{parser(note.body)}</div>

        <div className="detail-page__action">
          <button className="action" onClick={onArchiveHandler} title={note.archived ? "Batal Arsip" : "Arsipkan"}>
            {note.archived ? <BiArchiveOut /> : <BiArchiveIn />}
          </button>
          <button className="action" onClick={onDeleteHandler} title={locale === "id" ? "Hapus" : "Delete"}>
            <FiTrash2 />
          </button>
        </div>
      </section>
    </>
  );
}

export default Detail;
