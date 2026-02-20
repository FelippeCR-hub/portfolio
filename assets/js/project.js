
(async function(){
  const id = decodeURIComponent((location.hash || "").replace("#","").trim());
  const mount = document.getElementById("projectMount");
  if(!mount) return;

  const res = await fetch("assets/data/projects.json");
  const data = await res.json();
  const idx = Math.max(0, data.findIndex(p => p.id === id));
  const proj = data[idx] || data[0];
  const prev = data[(idx - 1 + data.length) % data.length];
  const next = data[(idx + 1) % data.length];
  const nextPrev = {prev, next};

  document.title = `${proj.title} | Felippe Santos`;

  const breadcrumb = document.getElementById("breadcrumb");
  if(breadcrumb){
    breadcrumb.innerHTML = `
      <a href="index.html">Home</a> /
      <a href="projects.html">Projetos</a> /
      <span>${escapeHtml(proj.title)}</span>
    `;
  }

  const pills = (proj.stack || []).map(s => `<span class="pill">${escapeHtml(s)}</span>`).join("");
  const bullets = (proj.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join("");
  const gallery = (proj.gallery || []).map((src, idx) => `
      <div class="shot" data-src="${escapeAttr(src)}" role="button" tabindex="0" aria-label="Abrir imagem ${idx+1}">
        <img src="${escapeAttr(src)}" alt="${escapeAttr(proj.title)} - imagem ${idx+1}">
      </div>
  `).join("");

  mount.innerHTML = `
    <div class="panel reveal in">
      <div class="kicker">PROJETO</div>
      <div class="h1" style="margin-top:10px">${escapeHtml(proj.title)}</div>
      <div class="sub">${escapeHtml(proj.tagline || "")}</div>

      <div style="margin-top:14px" class="pills">${pills}</div>

      <div style="margin-top:16px" class="grid">
        <div class="card" style="grid-column: span 6;">
          <h3>Objetivo</h3>
          <p>${escapeHtml((proj.objective || "Projeto fictício para portfolio — substitua pelo seu caso real."))}</p>
        </div>
        <div class="card" style="grid-column: span 6;">
          <h3>Destaques</h3>
          <ul class="bullets">${bullets}</ul>
        </div>
      </div>

      <div class="section-title" style="margin-top:18px">
        <h2>GALERIA</h2>
        <div class="hr"></div>
      </div>
      <div class="gallery">${gallery}</div>

      <div class="section-title" style="margin-top:22px">
        <h2>LINKS</h2>
        <div class="hr"></div>
      </div>
      <div class="hero-ctas">
        ${proj.links?.repo ? `<a class="btn ghost" target="_blank" rel="noreferrer" href="${escapeAttr(proj.links.repo)}">REPOSITÓRIO</a>` : ""}
        ${proj.links?.live ? `<a class="btn" target="_blank" rel="noreferrer" href="${escapeAttr(proj.links.live)}">DEMO</a>` : ""}
        <a class="btn ghost" href="project.html#${encodeURIComponent(nextPrev.prev.id)}">◀ ANTERIOR</a>
        <a class="btn ghost" href="project.html#${encodeURIComponent(nextPrev.next.id)}">PRÓXIMO ▶</a>
        <a class="btn" href="projects.html">VOLTAR</a>
      </div>
    </div>
  `;

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbClose = document.getElementById("lightboxClose");

  function open(src){
    lbImg.src = src;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function close(){
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  mount.querySelectorAll(".shot").forEach(el => {
    const src = el.getAttribute("data-src");
    el.addEventListener("click", () => open(src));
    el.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " ") open(src); });
  });
  lb.addEventListener("click", (e) => { if(e.target === lb) close(); });
  lbClose.addEventListener("click", close);
  window.addEventListener("keydown", (e)=>{ if(e.key === "Escape") close(); });

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  }
  function escapeAttr(str){ return escapeHtml(str).replace(/`/g, "&#96;"); }
})();
