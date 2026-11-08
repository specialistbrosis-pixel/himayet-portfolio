/* Md Himayet — accessible portfolio interactions */
(() => {
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");

  if (menuToggle && primaryNav) {
    const closeMenu = () => {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      primaryNav.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  const yearElement = document.getElementById("currentYear");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());

  // Add scroll reveals progressively; content remains visible if the API is unavailable.
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-art, .section-heading, .about-note, .about-text, " +
    ".project-card, .interest-card, .learning-intro, .learning-row, .contact-panel"
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-item");
    element.style.setProperty("--reveal-delay", String((index % 4) * 75) + "ms");
  });

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  // A minimal reading-progress line at the top of the page.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  const progressFill = document.createElement("span");
  progress.appendChild(progressFill);
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progressFill.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Highlight the navigation item for the section currently in view.
  if ("IntersectionObserver" in window && primaryNav) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targetId = "#" + entry.target.id;
        primaryNav.querySelectorAll('a[href^="#"]').forEach((link) => {
          if (link.getAttribute("href") === targetId) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });

    document.querySelectorAll("main section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  document.documentElement.classList.add("js-ready");
})();
