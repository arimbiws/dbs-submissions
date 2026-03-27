import React from "react";

function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "16px", marginTop: "32px", color: "var(--on-background-grey)" }}>
      <p>&copy; {new Date().getFullYear()} - Personal Notes App</p>
    </footer>
  );
}

export default Footer;
