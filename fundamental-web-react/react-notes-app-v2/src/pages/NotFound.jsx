import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LocaleContext } from "../contexts/LocaleContext";

function NotFound() {
  const { locale } = useContext(LocaleContext);
  return (
    <section className="not-found-page">
      <h2>404</h2>
      <p>{locale === "id" ? "Halaman tidak ditemukan." : "Page not found."}</p>
      <Link to="/">{locale === "id" ? "Kembali ke Beranda" : "Back to Home"}</Link>
    </section>
  );
}

export default NotFound;
