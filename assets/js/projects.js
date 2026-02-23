(async function () {
  const mount = document.getElementById("projectsGrid");
  if (!mount) return;

  const res = await fetch("assets/data/projects.json");
  const data = await res.json();

  const state = {
    filter: "all",
    q: ""
  };

  function card(p) {
    const pills = (p.stack || [])
      .slice(0, 5)
      .map((s) => `<span class="pill">${escapeHtml(s)}</span>`)
      .join("");
    return `
      <article class="card project-card reveal" data-category="${escapeAttr(p.category)}">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.tagline || "")}</p>
        <div class="pills">${pills}</div>
        <div class="links">
          <a class="mini-link" href="project.html#${encodeURIComponent(p.id)}">ABRIR</a>
          ${p.links?.repo ? `<a class="mini-link" href="${escapeAttr(p.links.repo)}" target="_blank" rel="noreferrer">REPO</a>` : ""}
          ${p.links?.live ? `<a class="mini-link" href="${escapeAttr(p.links.live)}" target="_blank" rel="noreferrer">LIVE</a>` : ""}
        </div>
      </article>
    `;
  }

  function render() {
    const filtered = data.filter((p) => {
      const okCat = state.filter === "all" ? true : p.category === state.filter;
      const hay = (
        p.title +
        " " +
        (p.tagline || "") +
        " " +
        (p.stack || []).join(" ")
      ).toLowerCase();
      const okQ = !state.q || hay.includes(state.q);
      return okCat && okQ;
    });
    mount.innerHTML = filtered.map(card).join("");
    requestAnimationFrame(() =>
      mount.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")),
    );
  }

  const searchInput = document.getElementById("projectSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.q = (searchInput.value || "").trim().toLowerCase();
      render();
    });
  }

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.filter = btn.getAttribute("data-filter") || "all";
      render();
    });
  });

  render();

  function escapeHtml(str) {
    return String(str).replace(
      /[&<>"']/g,
      (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[m],
    );
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, "&#96;");
  }
})();