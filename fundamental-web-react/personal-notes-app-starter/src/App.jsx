import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddNote from "./pages/AddNote";
import Detail from "./pages/Detail";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app-container">
      <Navbar />
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
  );
}

export default App;
