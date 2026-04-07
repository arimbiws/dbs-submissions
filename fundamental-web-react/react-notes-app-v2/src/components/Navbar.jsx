import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import { MdTranslate } from "react-icons/md";
import PropTypes from "prop-types";

function Navbar({ logout, name }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { locale, toggleLocale } = useContext(LocaleContext);

  return (
    <header>
      <h1>
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Note Buddy Logo" width="60" height="60" />
        </Link>
      </h1>
      <div className="navigation">
        <ul>
          {name && (
            <>
              <li>
                <Link to="/">{locale === "id" ? "Beranda" : "Home"}</Link>
              </li>
              <li>
                <Link to="/notes/new">{locale === "id" ? "Tambah" : "New Note"}</Link>
              </li>
              <li>
                <Link to="/archives">{locale === "id" ? "Arsip" : "Archived"}</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="action-nav">
        <button onClick={toggleLocale} className="toggle-btn" title="Ganti Bahasa">
          <MdTranslate /> {locale === "id" ? "EN" : "ID"}
        </button>
        <button onClick={toggleTheme} className="toggle-btn" title="Ganti Tema">
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
        {name && (
          <button onClick={logout} className="toggle-btn logout-btn" title="Keluar">
            {name} <FiLogOut />
          </button>
        )}
      </div>
    </header>
  );
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  name: PropTypes.string,
};

export default Navbar;
