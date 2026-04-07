import React, { useContext } from "react";
import { LocaleContext } from "../contexts/LocaleContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import parser from "html-react-parser";
import { showFormattedDate } from "../utils/index";

function NoteItem({ id, title, createdAt, body }) {
  const { locale } = useContext(LocaleContext);

  return (
    <div className="note-item">
      <h3 className="note-item__title">
        <Link to={`/notes/${id}`}>{title}</Link>
      </h3>
      <p className="note-item__createdAt">{showFormattedDate(createdAt, locale)}</p>
      <div className="note-item__body">{parser(body)}</div>
    </div>
  );
}

NoteItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default NoteItem;
