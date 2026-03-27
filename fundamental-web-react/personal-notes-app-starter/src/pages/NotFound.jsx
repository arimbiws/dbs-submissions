import React from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found-page">
      <h2>404</h2>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/">
        <FiArrowLeftCircle /> Kembali ke Beranda
      </Link>
    </section>
  );
}

export default NotFound;
