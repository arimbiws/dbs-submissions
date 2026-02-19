const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");
const body = document.body;

toggle.addEventListener("click", (e) => {
  nav.classList.toggle("active");

  if (nav.classList.contains("active")) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "auto";
  }

  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  if (nav.classList.contains("active") && !nav.contains(e.target)) {
    nav.classList.remove("active");
    body.style.overflow = "auto";
  }
});
