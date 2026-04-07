import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddNote from "./pages/AddNote";
import Detail from "./pages/Detail";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeContext } from "./contexts/ThemeContext";
import { LocaleContext } from "./contexts/LocaleContext";
import { getUserLogged, putAccessToken } from "./utils/network-data";

function App() {
  const [authedUser, setAuthedUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [locale, setLocale] = useState(localStorage.getItem("locale") || "id");

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  const toggleLocale = () => {
    setLocale((prevLocale) => {
      const newLocale = prevLocale === "id" ? "en" : "id";
      localStorage.setItem("locale", newLocale);
      return newLocale;
    });
  };

  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const localeContextValue = useMemo(() => ({ locale, toggleLocale }), [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await getUserLogged();
      setAuthedUser(data);
      setInitializing(false);
    };
    fetchUser();
  }, []);

  const onLoginSuccess = async ({ accessToken }) => {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    setAuthedUser(data);
  };

  const onLogout = () => {
    const confirmMessage = locale === "id" ? "Apakah Anda yakin ingin keluar?" : "Are you sure you want to log out?";

    if (window.confirm(confirmMessage)) {
      setAuthedUser(null);
      putAccessToken("");
    }
  };

  if (initializing) {
    return (
      <div className="app-container">
        <p className="loading-indicator">{locale === "id" ? "Memuat aplikasi..." : "Loading app..."}</p>
      </div>
    );
  }

  if (authedUser === null) {
    return (
      <ThemeContext.Provider value={themeContextValue}>
        <LocaleContext.Provider value={localeContextValue}>
          <div className="app-container">
            <Navbar logout={onLogout} name={null} />
            <main>
              <Routes>
                <Route path="/*" element={<Login loginSuccess={onLoginSuccess} />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </LocaleContext.Provider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <LocaleContext.Provider value={localeContextValue}>
        <div className="app-container">
          <Navbar logout={onLogout} name={authedUser.name} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/archives" element={<Archive />} />
              <Route path="/notes/new" element={<AddNote />} />
              <Route path="/notes/:id" element={<Detail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
