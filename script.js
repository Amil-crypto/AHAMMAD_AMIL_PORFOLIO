(() => {
  const profile = window.PORTFOLIO || {};
  const name = profile.name || "Your Name";
  document.querySelectorAll("[data-name]").forEach(el => {
    el.textContent = name;
    if (!el.classList.contains("signature-name")) return;
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return;
    const first = document.createElement("span");
    first.className = "name-first";
    first.textContent = words.slice(0, -1).join(" ");
    const last = document.createElement("span");
    last.className = "name-last";
    last.textContent = words.at(-1);
    el.replaceChildren(first, document.createTextNode(" "), last);
  });
  document.querySelectorAll("[data-initials]").forEach(el => { el.textContent = profile.initials || "YN"; });
  document.getElementById("year").textContent = new Date().getFullYear();
  document.title = `${name} — Software & Systems Portfolio`;
  document.querySelector('[property="og:title"]').content = document.title;
  if (profile.college || profile.graduationYear) {
    document.getElementById("education-detail").textContent = [profile.college, profile.graduationYear && `Class of ${profile.graduationYear}`, "India"].filter(Boolean).join(" · ");
  }
  const safeUrl = (value, local = false) => {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, location.href);
      if (url.protocol === "https:" || (local && url.origin === location.origin && ["http:", "file:"].includes(url.protocol))) return url.href;
    } catch {}
    return null;
  };
  const activateLink = (el, url, download = false) => {
    if (!el || !url) return;
    el.href = url;
    el.removeAttribute("aria-disabled");
    if (download) el.setAttribute("download", "");
    else { el.target = "_blank"; el.rel = "noopener noreferrer"; }
  };
  activateLink(document.getElementById("github-link"), safeUrl(profile.github));
  activateLink(document.getElementById("linkedin-link"), safeUrl(profile.linkedin));
  if (safeUrl(profile.linkedin)) document.getElementById("linkedin-link").firstChild.textContent = "LinkedIn ";
  const resume = safeUrl(profile.resume, true);
  if (resume) {
    document.querySelectorAll(".resume-link").forEach(el => activateLink(el, resume, true));
    document.querySelector(".resume-note").textContent = "A closer look at my background and work";
  }
  if (typeof profile.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    const email = document.getElementById("email-button");
    email.href = `mailto:${profile.email}`;
    email.removeAttribute("aria-disabled");
    email.replaceChildren(document.createTextNode("Let’s talk "));
    const arrow = document.createElement("span"); arrow.textContent = "↗"; arrow.setAttribute("aria-hidden", "true"); email.append(arrow);
  }
  document.querySelectorAll("[data-project]").forEach(container => {
    const project = profile.projects?.[container.dataset.project] || {};
    for (const [key, label] of [["github", "Source code"], ["demo", "Live demo"]]) {
      const url = safeUrl(project[key]);
      if (!url) continue;
      const link = document.createElement("a");
      link.textContent = `${label} ↗`;
      link.setAttribute("aria-label", `${label}: ${container.closest("article").querySelector("h3").textContent}`);
      activateLink(link, url); container.append(link);
    }
    if (!container.children.length) {
      const note = document.createElement("span"); note.className = "pending-link"; note.textContent = "Project links coming soon"; container.append(note);
    }
  });
  const siteUrl = safeUrl(profile.siteUrl);
  if (siteUrl) {
    const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = siteUrl; document.head.append(canonical);
    const ogUrl = document.createElement("meta"); ogUrl.setAttribute("property", "og:url"); ogUrl.content = siteUrl; document.head.append(ogUrl);
    const schema = document.createElement("script"); schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name, url: siteUrl, sameAs: [safeUrl(profile.github), safeUrl(profile.linkedin)].filter(Boolean), description: "Electronics and Communication Engineering student focused on Java, full-stack development, and machine learning." });
    document.head.append(schema);
  }
  const toggle = document.querySelector(".theme-toggle");
  const updateThemeLabel = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    toggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
    document.querySelector('meta[name="theme-color"]').content = dark ? "#151715" : "#f6f7f1";
  };
  updateThemeLabel();
  toggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("portfolio-theme", theme); } catch {}
    updateThemeLabel();
  });
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const revealElements = [...document.querySelectorAll(".reveal")];
  const art = document.querySelector(".system-art");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  let observer;
  let frame = 0;

  // Keep layout reads together, and only update once per animation frame.
  const updateScroll = () => {
    frame = 0;
    if (motionPreference.matches) return;
    const distance = document.documentElement.scrollHeight - innerHeight;
    const fraction = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    const bounds = art?.getBoundingClientRect();
    progress.style.transform = `scaleX(${fraction})`;
    if (bounds && bounds.bottom > 0 && bounds.top < innerHeight) {
      const position = Math.max(-1, Math.min(1, (innerHeight / 2 - bounds.top - bounds.height / 2) / innerHeight));
      art.style.setProperty("--art-shift", `${position * 36}px`);
      art.style.setProperty("--art-turn", `${position * 22}deg`);
    }
  };
  const queueScroll = () => {
    if (!frame && !motionPreference.matches) frame = requestAnimationFrame(updateScroll);
  };
  const reveal = el => {
    el.classList.remove("reveal-pending");
    el.classList.add("is-revealed");
    observer?.unobserve(el);
  };
  const configureMotion = () => {
    observer?.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("scroll", queueScroll);
    window.removeEventListener("resize", queueScroll);
    if (motionPreference.matches) {
      revealElements.forEach(reveal);
      art?.style.removeProperty("--art-shift");
      art?.style.removeProperty("--art-turn");
      return;
    }
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        // Stagger only elements arriving together, so single cards never wait.
        entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
          entry.target.style.setProperty("--reveal-delay", `${Math.min(index, 2) * 110}ms`);
          reveal(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
      revealElements.filter(el => !el.classList.contains("is-revealed")).forEach(el => {
        el.classList.add("reveal-pending");
        observer.observe(el);
      });
    }
    window.addEventListener("scroll", queueScroll, { passive: true });
    window.addEventListener("resize", queueScroll, { passive: true });
    queueScroll();
  };
  // Keyboard navigation must never land inside an invisible card.
  document.addEventListener("focusin", event => {
    const section = event.target.closest(".reveal-pending");
    if (section) { section.style.setProperty("--reveal-delay", "0ms"); reveal(section); }
  });
  motionPreference.addEventListener("change", configureMotion);
  configureMotion();
  document.fonts?.ready.then(queueScroll);
})();
