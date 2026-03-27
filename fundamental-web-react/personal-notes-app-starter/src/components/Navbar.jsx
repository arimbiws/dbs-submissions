import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <h1>
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Note Buddy Logo" width="60" height="60" />
        </Link>
      </h1>
      <div className="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/notes/new">Tambah</Link>
          </li>
          <li>
            <Link to="/archives">Arsip</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
