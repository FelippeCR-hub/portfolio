(async function () {
  const mount = document.getElementById("featuredGrid");
  if (!mount) return;

  const res = await fetch("assets/data/projects.json");
  const data = await res.json();
  const featured = data.filter(p => p.featured).slice(0, 3);

  mount.innerHTML = featured.map(p => `
    <article class="card reveal in">
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.tagline || "")}</p>
      <div class="pills">${(p.stack||[]).slice(0,5).map(s => `<span class="pill">${escapeHtml(s)}</span>`).join("")}</div>
      <div class="links">
        <a class="mini-link" href="project.html#${encodeURIComponent(p.id)}">ABRIR</a>
        ${p.links?.repo ? `<a class="mini-link" href="${escapeAttr(p.links.repo)}" target="_blank" rel="noreferrer">PROJETO NO GITHUB</a>` : ""}
        ${getLiveLink(p) ? `<a class="mini-link" href="${escapeAttr(getLiveLink(p))}" target="_blank" rel="noreferrer">SITE NA WEB</a>` : ""}
      </div>
    </article>
  `).join("");

  function getLiveLink(project) {
    return project.links?.live || project.web || "";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    } [m]));
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, "&#96;");
  }
})();


