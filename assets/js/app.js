

(function(){
  const body = document.body;
  const themeBtn = document.getElementById("themeToggle");

  const saved = localStorage.getItem("theme");
  if(saved === "light"){ body.classList.add("light"); }
  if(themeBtn){
    themeBtn.textContent = body.classList.contains("light") ? "☀️/🌑" : "☀️/🌑";
    themeBtn.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
      themeBtn.textContent = body.classList.contains("light") ? "☀️/🌑" : "☀️/🌑";
    });
  }

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if(!href) return;
    const h = href.split("/").pop();
    if(h === path){ a.classList.add("active"); }
  });

  const page = document.querySelector(".page");
  function isInternalLink(a){
    const href = a.getAttribute("href") || "";
    if(href.startsWith("http")) return false;
    if(href.startsWith("mailto:")) return false;
    if(href.startsWith("#")) return false;
    return href.endsWith(".html") || href.includes(".html#");
  }
  document.querySelectorAll("a").forEach(a => {
    if(!isInternalLink(a)) return;
    a.addEventListener("click", (e) => {
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      const href = a.getAttribute("href");
      if(page) page.classList.add("is-exiting");
      setTimeout(() => { window.location.href = href; }, 180);
    });
  });

  const items = Array.from(document.querySelectorAll(".reveal"));
  if(items.length){
    const io = new IntersectionObserver((entries) => {
      for(const ent of entries){
        if(ent.isIntersecting){
          ent.target.classList.add("in");
          io.unobserve(ent.target);
        }
      }
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  (async function(){
    try{
      const r = await fetch("assets/data/profile.json");
      const p = await r.json();
      document.querySelectorAll("[data-bind='name']").forEach(el => el.textContent = p.name || el.textContent);
      document.querySelectorAll("[data-bind='role']").forEach(el => el.textContent = p.role || el.textContent);
      document.querySelectorAll("[data-bind='email']").forEach(el => {
        el.textContent = p.email || el.textContent;
        if(el.tagName.toLowerCase()==="a"){ el.setAttribute("href", "mailto:" + (p.email||"")); }
      });
      document.querySelectorAll("[data-bind='github']").forEach(el => el.setAttribute("href", p.github || "#"));
      document.querySelectorAll("[data-bind='linkedin']").forEach(el => el.setAttribute("href", p.linkedin || "#"));
    }catch(e){}
  })();
})();
