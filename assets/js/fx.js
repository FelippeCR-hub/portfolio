
(function(){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce) return;

  const canvas = document.getElementById("particles");
  if(canvas){
    const ctx = canvas.getContext("2d", { alpha: true });
    let w=0, h=0, dpr=1;
    const colors = ["rgba(0,255,208,0.55)","rgba(255,0,128,0.50)","rgba(124,58,237,0.45)"];
    const rand = (a,b)=>a+Math.random()*(b-a);
    let pts=[];

    function resize(){
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      const N = Math.min(110, Math.max(40, Math.floor((innerWidth*innerHeight)/24000)));
      pts = Array.from({length:N}).map(()=> ({
        x: rand(0,w), y: rand(0,h),
        vx: rand(-0.12,0.12)*dpr, vy: rand(-0.12,0.12)*dpr,
        r: rand(0.9, 2.1)*dpr,
        c: colors[Math.floor(rand(0, colors.length))]
      }));
    }
    window.addEventListener("resize", resize, { passive:true });
    resize();

    function step(){
      ctx.clearRect(0,0,w,h);
      for(const p of pts){
        p.x += p.vx; p.y += p.vy;
        if(p.x < -20) p.x = w+20;
        if(p.x > w+20) p.x = -20;
        if(p.y < -20) p.y = h+20;
        if(p.y > h+20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      for(let i=0;i<pts.length;i++){
        for(let j=i+1;j<pts.length;j++){
          const a=pts[i], b=pts[j];
          const dx=a.x-b.x, dy=a.y-b.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          const max=140*dpr;
          if(dist < max){
            const alpha = (1 - dist/max) * 0.22;
            ctx.strokeStyle = `rgba(0,255,208,${alpha})`;
            ctx.lineWidth = 1*dpr;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    step();
  }

  const blobs = document.querySelector(".blobs");
  if(blobs){
    blobs.setAttribute("data-parallax","on");
    let mx=0, my=0, raf=0;
    function onMove(e){
      mx = (e.clientX / innerWidth) - 0.5;
      my = (e.clientY / innerHeight) - 0.5;
      if(!raf){
        raf = requestAnimationFrame(() => {
          raf = 0;
          blobs.style.setProperty("--px", (mx*24).toFixed(2) + "px");
          blobs.style.setProperty("--py", (my*18).toFixed(2) + "px");
        });
      }
    }
    window.addEventListener("mousemove", onMove, { passive:true });
  }
})();
