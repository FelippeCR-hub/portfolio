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
        <a class="mini-link" href="projects.html">VER TODOS</a>
      </div>
    </article>
  `).join("");

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    } [m]));
  }
})();