(function () {
  const body = document.body;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  
  document.documentElement.classList.add("js");

  
  
  
  const themeBtn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    body.classList.add("light");
  }

  if (themeBtn) {
    themeBtn.textContent = "☀️/🌑";
    themeBtn.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
      themeBtn.textContent = "☀️/🌑";
    });
  }

  
  
  
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    const h = href.split("/").pop();
    if (h === path) {
      a.classList.add("active");
    }
  });

  
  
  
  function ensureRouteFx() {
    if (document.getElementById("routeFx")) return;
    const wrap = document.createElement("div");
    wrap.id = "routeFx";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `<div class="fx"></div>`;
    document.body.appendChild(wrap);
  }
  ensureRouteFx();

  if (!reduce) {
    body.classList.add("route-in");
    window.setTimeout(() => body.classList.remove("route-in"), 520);
  }

  const page = document.querySelector(".page");

  function isInternalLink(a) {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("http")) return false;
    if (href.startsWith("mailto:")) return false;
    if (href.startsWith("#")) return false;
    return href.endsWith(".html") || href.includes(".html#");
  }

  document.querySelectorAll("a").forEach(a => {
    if (!isInternalLink(a)) return;
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = a.getAttribute("href");
      if (!href) return;

      
      const parts = href.split("#");
      if (parts.length > 1) {
        const base = (parts[0] || "").trim();
        const hash = parts[1];
        const here = (window.location.pathname.split("/").pop() || "index.html");
        if ((!base || base === here) && hash) {
          const el = document.getElementById(hash);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({
              behavior: reduce ? "auto" : "smooth",
              block: "start"
            });
            try {
              history.pushState(null, "", (base ? base : "") + "#" + hash);
            } catch (_) {}
            if (!reduce) {
              el.classList.add("fx-target");
              window.setTimeout(() => el.classList.remove("fx-target"), 950);
            }
            return;
          }
        }
      }

      e.preventDefault();

      if (!reduce) {
        body.classList.add("route-out");
        if (page) page.classList.add("is-exiting");
        window.setTimeout(() => {
          window.location.href = href;
        }, 360);
      } else {
        window.location.href = href;
      }
    });
  });

  
  
  
  const items = Array.from(document.querySelectorAll(".reveal"));
  
  items.forEach((el, i) => {
    if (el.dataset && el.dataset.delay) return;
    const d = Math.min(420, i * 60);
    el.style.transitionDelay = d + "ms";
  });
  if (items.length) {
    const io = new IntersectionObserver((entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.classList.add("in");
          if (!reduce) {
            ent.target.classList.add("glitch-in");
            window.setTimeout(() => ent.target.classList.remove("glitch-in"), 650);
          }
          io.unobserve(ent.target);
        }
      }
    }, {
      threshold: 0.12
    });
    items.forEach(el => io.observe(el));
  }

  
  
  
  const h1 = document.querySelector(".h1");
  if (h1) {
    const txt = (h1.innerText || "").replace(/\s+/g, " ").trim();
    if (txt) h1.setAttribute("data-glitch", txt);

    function pulse() {
      if (reduce) return;
      h1.classList.add("glitching");
      window.setTimeout(() => h1.classList.remove("glitching"), 560);
    }
    
    window.setTimeout(pulse, 120);
    
    h1.addEventListener("mouseenter", pulse);
  }

  
  
  
  const tagline = document.querySelector(".tagline");
  if (tagline && !reduce) {
    const original = tagline.textContent || "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-_=?:;[]{}<>/\\|";
    let frame = 0;
    const duration = 28; 
    const total = original.length + duration;

    tagline.classList.add("is-decrypting");

    const tick = () => {
      frame++;
      const revealCount = Math.max(0, frame - duration);
      let out = "";

      for (let i = 0; i < original.length; i++) {
        if (i < revealCount) {
          out += original[i];
        } else {
          const ch = original[i];
          
          if (ch === " " || ch === "\n" || ch === "\t") {
            out += ch;
          } else if (/[.,;:()ºª\-•]/.test(ch)) {
            out += ch;
          } else {
            out += chars[(Math.random() * chars.length) | 0];
          }
        }
      }
      tagline.textContent = out;

      if (frame < total) {
        requestAnimationFrame(tick);
      } else {
        tagline.textContent = original;
        tagline.classList.remove("is-decrypting");
      }
    };

    requestAnimationFrame(tick);
  }

  
  
  
  (async function () {
    try {
      const r = await fetch("assets/data/profile.json");
      const p = await r.json();
      document.querySelectorAll("[data-bind='name']").forEach(el => el.textContent = p.name || el.textContent);
      document.querySelectorAll("[data-bind='role']").forEach(el => el.textContent = p.role || el.textContent);
      document.querySelectorAll("[data-bind='email']").forEach(el => {
        el.textContent = p.email || el.textContent;
        if (el.tagName.toLowerCase() === "a") {
          el.setAttribute("href", "mailto:" + (p.email || ""));
        }
      });
      document.querySelectorAll("[data-bind='github']").forEach(el => el.setAttribute("href", p.github || "#"));
      document.querySelectorAll("[data-bind='linkedin']").forEach(el => el.setAttribute("href", p.linkedin || "#"));
    } catch (e) {}
  })();

  
  
  
  const imgs = Array.from(document.querySelectorAll("img"));
  if (imgs.length) {
    imgs.forEach(img => {
      
      if (img.classList.contains("fx-img")) return;
      img.classList.add("fx-img");
      const show = () => {
        
        requestAnimationFrame(() => img.classList.add("img-in"));
      };
      if (img.complete) show();
      else {
        img.addEventListener("load", show, {
          once: true
        });
        img.addEventListener("error", show, {
          once: true
        });
      }
    });
  }

})();

(() => {
  const el = document.getElementById("heroName");
  if (!el) return;

  
  const originalHTML = el.innerHTML;
  const finalText = el.textContent;

  
  el.innerHTML = "";
  el.classList.add("is-typing");

  let i = 0;

  
  
  const tick = () => {
    i++;
    el.textContent = finalText.slice(0, i);

    if (i < finalText.length) {
      requestAnimationFrame(() => setTimeout(tick, 40)); 
    } else {
      
      el.innerHTML = originalHTML;
      el.classList.remove("is-typing");
      el.classList.add("is-done");
    }
  };

  
  setTimeout(tick, 200);
})();