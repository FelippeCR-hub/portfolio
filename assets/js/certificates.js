(async function () {
  const mount = document.getElementById("certGrid");
  if (!mount) return;
  try {
    const res = await fetch("assets/data/certificates.json");
    const certs = await res.json();
    mount.innerHTML = certs.map(c => `
      <article class="cert-card reveal in">
        <div class="cert-badge"><img src="${escapeAttr(c.badge)}" alt="Logo ${escapeAttr(c.institution)}"></div>
        <div class="cert-meta">
          <h3 class="cert-name">${escapeHtml(c.name)}</h3>
          <p class="cert-inst">${escapeHtml(c.institution)}</p>
          <div class="cert-year">${escapeHtml(c.year)}</div>
        </div>
      </article>
    `).join("");
  } catch (e) {
    console.error(e);
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