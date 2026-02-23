(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;


  function cssVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim() ||
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function hexToRgba(hex, a) {
    const h = hex.replace("#", "").trim();
    if (h.length !== 6) return `rgba(255,255,255,${a})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }


  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d", {
      alpha: true
    });

    let w = 0,
      h = 0,
      dpr = 1;
    let pts = [];
    let t0 = performance.now();

    let colA = cssVar("--a") || "#00ffff";
    let colB = cssVar("--b") || "#ff00ff";
    let colC = cssVar("--c") || "#ffaa00";

    function refreshColors() {
      colA = cssVar("--a") || colA;
      colB = cssVar("--b") || colB;
      colC = cssVar("--c") || colC;
    }

    const mo = new MutationObserver(() => refreshColors());
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";

      const N = Math.min(120, Math.max(48, Math.floor((innerWidth * innerHeight) / 22000)));
      const palette = [
        () => hexToRgba(colA, 0.55),
        () => hexToRgba(colB, 0.48),
        () => hexToRgba(colC, 0.42)
      ];

      pts = Array.from({
        length: N
      }).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.16, 0.16) * dpr,
        vy: rand(-0.16, 0.16) * dpr,
        r: rand(0.9, 2.2) * dpr,
        c: palette[(Math.random() * palette.length) | 0]()
      }));
    }

    window.addEventListener("resize", resize, {
      passive: true
    });
    resize();

    
    let mx = 0,
      my = 0;
    window.addEventListener("mousemove", (e) => {
      mx = (e.clientX / innerWidth) - 0.5;
      my = (e.clientY / innerHeight) - 0.5;
    }, {
      passive: true
    });

    function step(now) {
      const dt = Math.min(34, now - t0);
      t0 = now;

      ctx.clearRect(0, 0, w, h);

      
      const pulse = 0.55 + 0.45 * Math.sin(now * 0.0008);

      
      for (const p of pts) {
        
        p.x += p.vx + (mx * 0.018 * dpr);
        p.y += p.vy + (my * 0.016 * dpr);

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.90 * pulse;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      
      const max = 150 * dpr;
      const lineCol = hexToRgba(colA, 0.20);

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i],
            b = pts[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < max) {
            const alpha = (1 - dist / max) * 0.26;
            ctx.strokeStyle = lineCol.replace(/0\.20\)$/, `${(alpha*0.9).toFixed(3)})`);
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  
  
  
  const blobs = document.querySelector(".blobs");
  if (blobs) {
    blobs.setAttribute("data-parallax", "on");
    let mx = 0,
      my = 0,
      raf = 0;

    function onMove(e) {
      mx = (e.clientX / innerWidth) - 0.5;
      my = (e.clientY / innerHeight) - 0.5;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          blobs.style.setProperty("--px", (mx * 24).toFixed(2) + "px");
          blobs.style.setProperty("--py", (my * 18).toFixed(2) + "px");
        });
      }
    }
    window.addEventListener("mousemove", onMove, {
      passive: true
    });
  }
})();