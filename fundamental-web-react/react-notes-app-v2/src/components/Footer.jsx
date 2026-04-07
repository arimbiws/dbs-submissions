import React, { useContext } from "react";
import { LocaleContext } from "../contexts/LocaleContext";

function Footer() {
  const { locale } = useContext(LocaleContext);

  return (
    <footer className="app-footer">
      <p>
        Note Buddy - {locale === "id" ? "Aplikasi Catatan Pribadi" : "Personal Notes App"} &copy; Coding Camp {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default Footer;
