const navLinks = Array.from(document.querySelectorAll("[data-nav-section]"));
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.navSection))
  .filter(Boolean);

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.navSection === id);
  });
}

let ticking = false;

function updateActiveFromScroll() {
  if (!sections.length) return;

  const probeY = window.scrollY + window.innerHeight * 0.34;
  let current = sections[0].id;

  sections.forEach((section) => {
    if (probeY >= section.offsetTop - 90) {
      current = section.id;
    }
  });

  setActiveNav(current);
}

function requestNavUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveFromScroll();
    ticking = false;
  });
}

function initLanguageSwitcher() {
  const languageToggle = document.querySelector(".language-toggle");
  const languageMenu = document.querySelector(".language-menu");

  if (!languageToggle || !languageMenu) return;

  languageToggle.addEventListener("click", () => {
    const isHidden = languageMenu.hasAttribute("hidden");
    languageMenu.toggleAttribute("hidden", !isHidden);
    languageToggle.setAttribute("aria-expanded", String(isHidden));
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (languageToggle.contains(event.target) || languageMenu.contains(event.target)) return;

    languageMenu.setAttribute("hidden", "");
    languageToggle.setAttribute("aria-expanded", "false");
  });
}

function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  if (!navToggle || !nav) return;

  const menuLabels = {
    en: ["Open menu", "Close menu"],
    uk: ["Відкрити меню", "Закрити меню"],
    de: ["Menü öffnen", "Menü schließen"],
    es: ["Abrir menú", "Cerrar menú"],
    pt: ["Abrir menu", "Fechar menu"]
  };
  const [openLabel, closeLabel] = menuLabels[document.documentElement.lang] || [
    "Открыть меню",
    "Закрыть меню"
  ];

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", openLabel);
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeNav();
    }
  });
}

if (sections.length) {
  window.addEventListener("scroll", requestNavUpdate, { passive: true });
  window.addEventListener("resize", requestNavUpdate);
  updateActiveFromScroll();
}

initLanguageSwitcher();
initMobileNav();
