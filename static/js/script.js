/* ============================================================
   SCRIPT.JS — Alex Chen Portfolio
   All interactive features: cursor, loader, scroll, particles,
   typing, counters, form validation, theme toggle, tilt cards.
   ============================================================ */

"use strict";

/* ── Utility ────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. LOADER
   ============================================================ */
window.addEventListener("load", () => {
  const loader = $("#loader");
  // Wait for fill animation (1.4s) + a tiny buffer
  setTimeout(() => {
    loader.classList.add("hidden");
    // Trigger hero animations after loader gone
    triggerHeroReveals();
  }, 1600);
});

function triggerHeroReveals() {
  $$(".reveal-up, .reveal-left, .reveal-right", $("#hero")).forEach(el => {
    el.classList.add("revealed");
  });
  // Start typing after hero text visible
  setTimeout(startTyping, 400);
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = $("#cursor");
  const follower = $("#cursor-follower");
  let fx = 0, fy = 0; // follower position

  document.addEventListener("mousemove", e => {
    // Dot snaps instantly
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
    // Follower lags (handled in rAF below)
    fx += (e.clientX - fx) * 0.12;
    fy += (e.clientY - fy) * 0.12;
  });

  // Smooth follower loop
  (function loop() {
    requestAnimationFrame(loop);
    follower.style.left = fx + "px";
    follower.style.top  = fy + "px";
  })();

  // Hover state
  document.addEventListener("mouseover", e => {
    const hoverable = e.target.closest("a, button, .project-card, .specialty-card, input, textarea");
    document.body.classList.toggle("cursor-hover", !!hoverable);
  });

  // Hide when cursor leaves window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity   = "0";
    follower.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity   = "1";
    follower.style.opacity = "0.6";
  });
})();

/* ============================================================
   3. NAVBAR — glassmorphism + active section + hamburger
   ============================================================ */
(function initNavbar() {
  const navbar   = $("#navbar");
  const hamburger = $("#navHamburger");
  const mobileMenu = $("#mobileMenu");
  let menuOpen = false;

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    // Animate hamburger lines
    const spans = $$("span", hamburger);
    if (menuOpen) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    }
  });

  // Close mobile menu on link click
  $$(".mob-link").forEach(link => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.classList.remove("open");
      $$("span", hamburger).forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    });
  });

  // Active section highlight via IntersectionObserver
  const sections = $$("section[id]");
  const navLinks = $$(".nav-link");

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
})();

/* ============================================================
   4. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const btn  = $("#themeToggle");
  const icon = btn.querySelector("i");
  let dark = localStorage.getItem("theme") === "dark";

  function applyTheme() {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    icon.className = dark ? "fas fa-sun" : "fas fa-moon";
  }
  applyTheme();

  btn.addEventListener("click", () => {
    dark = !dark;
    localStorage.setItem("theme", dark ? "dark" : "light");
    applyTheme();
  });
})();

/* ============================================================
   5. SMOOTH SCROLL (for all anchor links)
   ============================================================ */
document.addEventListener("click", e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth" });
});

/* ============================================================
   6. PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = $("#particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Particle class
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const isDark = document.documentElement.dataset.theme === "dark";
      ctx.fillStyle = isDark
        ? `rgba(255,255,255,${this.alpha})`
        : `rgba(0,113,227,${this.alpha * 0.6})`;
      ctx.fill();
    }
  }

  // Create 80 particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connections between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const isDark = document.documentElement.dataset.theme === "dark";
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(255,255,255,${0.06 * (1 - dist / 100)})`
            : `rgba(0,113,227,${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   7. TYPING EFFECT
   ============================================================ */
function startTyping() {
  const el = $("#typed-text");
  if (!el) return;
  const phrases = [
    "ML Engineer & Researcher.",
    "Full-Stack Developer.",
    "AI Systems Builder.",
    "Open-Source Contributor.",
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 55, SPEED_DEL = 30, PAUSE = 1800;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
}

/* ============================================================
   8. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const els = $$(".reveal-up, .reveal-left, .reveal-right");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  // Skip hero elements (animated on load)
  els.forEach(el => {
    if (!el.closest("#hero")) obs.observe(el);
  });
})();

/* ============================================================
   9. SKILL BARS (animate on scroll into view)
   ============================================================ */
(function initSkillBars() {
  const bars = $$(".skill-bar-item");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

/* ============================================================
   10. COUNTER ANIMATION (stats in About)
   ============================================================ */
(function initCounters() {
  const counters = $$(".stat-num[data-target]");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1400;
      const start  = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / dur, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ============================================================
   11. 3D TILT EFFECT on project cards
   ============================================================ */
(function initTilt() {
  const cards = $$("[data-tilt]");

  cards.forEach(card => {
    let rect;

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", e => {
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `
        perspective(800px)
        rotateY(${dx * 7}deg)
        rotateX(${-dy * 7}deg)
        translateY(-10px)
        scale(1.02)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ============================================================
   12. BUTTON RIPPLE (click effect)
   ============================================================ */
document.addEventListener("click", e => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position:absolute;
    width:${Math.max(r.width, r.height) * 2}px;
    height:${Math.max(r.width, r.height) * 2}px;
    left:${e.clientX - r.left}px;
    top:${e.clientY - r.top}px;
    background:rgba(255,255,255,0.3);
    border-radius:50%;
    transform:translate(-50%,-50%) scale(0);
    animation:rippleAnim 0.6s ease-out forwards;
    pointer-events:none;
  `;
  btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

// Inject ripple keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%,-50%) scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ============================================================
   13. CONTACT FORM VALIDATION
   ============================================================ */
(function initForm() {
  const form       = $("#contactForm");
  if (!form) return;
  const nameInput  = $("#name");
  const emailInput = $("#email");
  const msgInput   = $("#message");
  const submitBtn  = $("#submitBtn");
  const success    = $("#formSuccess");

  function showError(inputEl, errEl, msg) {
    inputEl.classList.add("error");
    errEl.textContent = msg;
  }
  function clearError(inputEl, errEl) {
    inputEl.classList.remove("error");
    errEl.textContent = "";
  }

  // Live validation
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim().length >= 2) clearError(nameInput, $("#nameError"));
  });
  emailInput.addEventListener("input", () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) clearError(emailInput, $("#emailError"));
  });
  msgInput.addEventListener("input", () => {
    if (msgInput.value.trim().length >= 10) clearError(msgInput, $("#messageError"));
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    let valid = true;

    // Name
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, $("#nameError"), "Please enter your name.");
      valid = false;
    } else clearError(nameInput, $("#nameError"));

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      showError(emailInput, $("#emailError"), "Enter a valid email address.");
      valid = false;
    } else clearError(emailInput, $("#emailError"));

    // Message
    if (msgInput.value.trim().length < 10) {
      showError(msgInput, $("#messageError"), "Message must be at least 10 characters.");
      valid = false;
    } else clearError(msgInput, $("#messageError"));

    if (!valid) return;

    // Simulate submission
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    const btnIcon   = submitBtn.querySelector(".btn-icon");
    btnText.textContent = "Sending…";
    btnLoader.style.display = "inline-flex";
    btnIcon.style.display   = "none";
    submitBtn.disabled = true;

    // setTimeout(() => {
    //   // Reset form
    //   form.reset();
    //   btnText.textContent = "Send Message";
    //   btnLoader.style.display = "none";
    //   btnIcon.style.display   = "inline-flex";
    //   submitBtn.disabled = false;
    //   success.style.display = "flex";
    //   setTimeout(() => { success.style.display = "none"; }, 5000);
    // }, 1800);

     try {
    const formData = new FormData(form);

    // ✅ REAL REQUEST to Flask
    const res = await fetch("/submit", {
      method: "POST",
      body: formData
    });

    // optional: check response
    if (!res.ok) throw new Error("Failed");

    // ✅ Success
    form.reset();
    success.style.display = "flex";

    setTimeout(() => {
      success.style.display = "none";
    }, 5000);

  } catch (err) {
    console.error("Error:", err);
  }

  // 🔥 Loader OFF
  btnText.textContent = "Send Message";
  btnLoader.style.display = "none";
  btnIcon.style.display = "inline-flex";
  submitBtn.disabled = false;
  });
})();

/* ============================================================
   14. NAVBAR scroll-shadow
   ============================================================ */
window.addEventListener("scroll", () => {
  const navbar = $("#navbar");
  if (window.scrollY > 20) {
    navbar.style.boxShadow = "0 1px 40px rgba(0,0,0,0.08)";
  } else {
    navbar.style.boxShadow = "";
  }
}, { passive: true });

/* ============================================================
   15. MARQUEE pause on hover
   ============================================================ */
$$(".marquee-track").forEach(track => {
  track.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });
  track.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });
});

/* ============================================================
   16. FOOTER "Back to top" via logo click
   ============================================================ */
$(".footer-logo") && $(".footer-logo").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});