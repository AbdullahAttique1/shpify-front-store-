/* =========================================================
   ATELIER THEME (Design 3) – Header, Hero, Marquee, Bento
   GSAP + ScrollTrigger are loaded from CDN in atelier.html
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded – animations skipped.");
    return;
  }
  const hasST = typeof ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const hdrIn = document.getElementById("hdrIn");

  /* ------------------------------------------------------
     1. PAGE LOAD – masked line reveal + elements
  ------------------------------------------------------ */
  const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

  intro
    .from(".ann p", { y: 14, opacity: 0, duration: 0.6 })
    .from(".hdr__in", { yPercent: -140, duration: 1, ease: "power3.out" }, "-=0.3")
    .from(".hdr__in .menu a, .hdr__in .tools > *", { y: -12, opacity: 0, duration: 0.6, stagger: 0.06 }, "-=0.6")
    .from(".hero__copy .kicker", { y: 20, opacity: 0, duration: 0.7 }, "-=0.7")
    .from(".hero__title .line > span", { yPercent: 115, duration: 1.2, stagger: 0.12 }, "-=0.5")
    .from(".hero__text", { y: 30, opacity: 0, duration: 0.8 }, "-=0.8")
    .from(".hero__cta .btn", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.7")
    .from(".stats li", { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
    .fromTo(".arch",
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, 0.5)
    .from(".arch img", { scale: 1.3, duration: 1.8, ease: "power3.out" }, 0.5)
    .from(".hero__small", { y: 70, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.9")
    .from(".badge", { scale: 0, rotation: -90, duration: 1, ease: "back.out(1.6)" }, "-=0.7")
    .from(".tagcard", { x: 60, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.7");

  /* count-up numbers */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2.2,
      delay: 1.6,
      ease: "power2.out",
      onUpdate: () => { el.textContent = Math.round(obj.v); }
    });
  });

  /* rotating badge text */
  gsap.to(".badge > svg", { rotation: 360, duration: 16, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

  /* ------------------------------------------------------
     2. HEADER – glass pill, hides on scroll down, shows on up
  ------------------------------------------------------ */
  let lastY = window.scrollY;
  let hdrHidden = false;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    hdrIn.classList.toggle("is-scrolled", y > 30);

    if (y > lastY && y > 260 && !hdrHidden) {
      hdrHidden = true;
      gsap.to(hdrIn, { y: -110, duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
    } else if ((y < lastY || y < 260) && hdrHidden) {
      hdrHidden = false;
      gsap.to(hdrIn, { y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    }
    lastY = y;
  }, { passive: true });

  /* ------------------------------------------------------
     3. FULLSCREEN MENU
  ------------------------------------------------------ */
  const mm = document.getElementById("mm");
  const mmLinks = mm.querySelectorAll(".mm__nav a span");

  const menuTl = gsap.timeline({ paused: true });
  menuTl
    .set(mm, { visibility: "visible" })
    .to(mm, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" })
    .from(mmLinks, { yPercent: 110, duration: 0.8, stagger: 0.07, ease: "power4.out" }, "-=0.35")
    .from(".mm__foot, .mm__close", { opacity: 0, duration: 0.5 }, "-=0.5");

  const openMenu = () => {
    mm.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    menuTl.timeScale(1).play();
  };
  const closeMenu = () => {
    mm.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    menuTl.timeScale(1.8).reverse();
  };
  document.getElementById("burger").addEventListener("click", openMenu);
  document.getElementById("mmClose").addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ------------------------------------------------------
     4. MAGNETIC BUTTONS (desktop pointers only)
  ------------------------------------------------------ */
  if (window.matchMedia("(hover: hover) and (min-width: 992px)").matches) {
    document.querySelectorAll("[data-magnet]").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      btn.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ------------------------------------------------------
     5. HERO PARALLAX – mouse (floating pieces) + scroll (image)
  ------------------------------------------------------ */
  const hero = document.querySelector(".hero");

  if (window.matchMedia("(hover: hover) and (min-width: 992px)").matches) {
    const pieces = [
      { el: document.querySelector(".hero__small"), depth: 28 },
      { el: document.querySelector(".badge"), depth: -22 },
      { el: document.querySelector(".tagcard"), depth: 18 }
    ].map((p) => ({
      ...p,
      x: gsap.quickTo(p.el, "xPercent", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(p.el, "yPercent", { duration: 0.9, ease: "power3.out" })
    }));

    hero.addEventListener("mousemove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      pieces.forEach((p) => { p.x(nx * p.depth); p.y(ny * p.depth); });
    });
  }

  if (hasST) {
    gsap.to(".arch img", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.fromTo(".hero__small",
      { y: 0 },
      {
        y: -50,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
  }

  /* ------------------------------------------------------
     6. MARQUEE – infinite loop, speeds with scroll, slows on hover
  ------------------------------------------------------ */
  const track = document.getElementById("marqueeTrack");
  const marquee = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });

  track.addEventListener("mouseenter", () => gsap.to(marquee, { timeScale: 0.2, duration: 0.5 }));
  track.addEventListener("mouseleave", () => gsap.to(marquee, { timeScale: 1, duration: 0.5 }));

  if (hasST) {
    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 4);
        gsap.to(marquee, { timeScale: self.direction * boost, duration: 0.3, overwrite: true });
        gsap.to(marquee, { timeScale: 1, duration: 1, delay: 0.3 });
      }
    });
  }

  /* ======================================================
     NEW SECTIONS (SUPER-style pattern)
  ====================================================== */

  /* ------------------------------------------------------
     8. REUSABLE SLIDER  ([data-slider])
        arrows, drag/swipe, progress bar
  ------------------------------------------------------ */
  function initSlider(root) {
    const vp = root.querySelector(".slider__vp");
    const track = root.querySelector(".slider__track");
    const slides = Array.from(track.children);
    const prev = root.querySelector(".slider__prev");
    const next = root.querySelector(".slider__next");
    const bar = root.querySelector(".slider__bar span");

    let index = 0;
    let startX = null;
    let dragged = false;

    const metrics = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = slides[0].offsetWidth + gap;
      const max = Math.max(0, track.scrollWidth - vp.clientWidth);
      return { step, max };
    };

    const update = (animate = true) => {
      const { step, max } = metrics();
      const maxIndex = Math.ceil(max / step);
      index = Math.min(Math.max(index, 0), maxIndex);
      const x = Math.min(index * step, max);
      const d = animate ? 0.8 : 0;

      gsap.to(track, { x: -x, duration: d, ease: "power3.out" });
      if (bar) {
        gsap.to(bar, {
          scaleX: Math.min(1, (x + vp.clientWidth) / track.scrollWidth),
          duration: d,
          ease: "power3.out"
        });
      }
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = x >= max - 1;
    };

    const pills = Array.from(root.querySelectorAll(".cpill[data-slide]"));
    const setActive = (i) => pills.forEach((b, k) => b.classList.toggle("is-active", k === i));

    if (next) next.addEventListener("click", () => { index++; update(); setActive(index); });
    if (prev) prev.addEventListener("click", () => { index--; update(); setActive(index); });

    pills.forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.slide, 10) || 0;
        index = i;
        update();
        setActive(i);
        gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
      });
    });

    vp.addEventListener("pointerdown", (e) => { startX = e.clientX; dragged = false; });
    window.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 8) dragged = true;
      if (dx < -50) { index++; update(); setActive(index); }
      else if (dx > 50) { index--; update(); setActive(index); }
      startX = null;
    });
    vp.addEventListener("click", (e) => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
    }, true);

    window.addEventListener("resize", () => update(false));
    window.addEventListener("load", () => update(false));
    update(false);
  }
  document.querySelectorAll("[data-slider]").forEach(initSlider);

  /* ------------------------------------------------------
     9. PRODUCT CARDS – wishlist + quick add
  ------------------------------------------------------ */
  document.querySelectorAll(".pc__wish").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-active");
      gsap.fromTo(btn, { scale: 0.7 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
    });
  });

  const bagCount = document.getElementById("bagCount");
  document.querySelectorAll(".pc__add").forEach((btn) => {
    btn.addEventListener("click", () => {
      bagCount.textContent = parseInt(bagCount.textContent, 10) + 1;
      gsap.fromTo(".bag b", { scale: 1.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      btn.textContent = "Added \u2713";
      setTimeout(() => (btn.textContent = "Quick add"), 1400);
    });
  });

  /* ------------------------------------------------------
     10. COLLECTION PANELS – list items stagger on hover
  ------------------------------------------------------ */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".look").forEach((look) => {
      const items = look.querySelectorAll(".look__list li, .look__list .look__link");
      look.addEventListener("mouseenter", () => {
        gsap.fromTo(items,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, delay: 0.15, ease: "power3.out", overwrite: true });
      });
    });
  }

  /* ------------------------------------------------------
     11. SCROLL REVEALS
  ------------------------------------------------------ */
  if (hasST) {
    /* inspiration */
    gsap.from(".insp__head > *", {
      y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: ".insp", start: "top 78%", once: true }
    });
    gsap.from(".icard", {
      y: 90, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".insp .slider", start: "top 88%", once: true }
    });
    gsap.from(".slider__foot", {
      opacity: 0, y: 20, duration: 0.7,
      scrollTrigger: { trigger: ".slider__foot", start: "top 98%", once: true }
    });

    /* category slider under the bento */
    gsap.from(".cslider__head > *", {
      y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".cslider", start: "top 92%", once: true }
    });
    gsap.from(".cslider .cpill", {
      x: 40, opacity: 0, duration: 0.8, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: ".cslider .slider__vp", start: "top 92%", once: true }
    });

    /* inspiration arrows */
    gsap.from(".insp__bar .cpill", {
      x: -24, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ".insp__bar", start: "top 90%", once: true }
    });
    gsap.from(".insp__bar .slider__nav button", {
      scale: 0.6, opacity: 0, duration: 0.7, stagger: 0.1, ease: "back.out(2)",
      scrollTrigger: { trigger: ".insp__bar", start: "top 90%", once: true }
    });

    /* text + bag image */
    gsap.from(".insp__featcopy > *", {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".insp__feat", start: "top 78%", once: true }
    });
    gsap.fromTo(".insp__featimg",
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".insp__feat", start: "top 78%", once: true }
      });
    gsap.fromTo(".insp__featimg img",
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: ".insp__featimg", start: "top bottom", end: "bottom top", scrub: true }
      });

    /* most loved */
    gsap.from(".loved .sec-head > *", {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".loved", start: "top 80%", once: true }
    });
    gsap.from(".pc", {
      y: 70, opacity: 0, duration: 0.9, stagger: 0.09, ease: "power3.out",
      scrollTrigger: { trigger: ".pgrid", start: "top 85%", once: true }
    });

    /* collection panels – curtain reveal */
    gsap.fromTo(".look",
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".looks", start: "top 80%", once: true }
      });

    /* editorial */
    gsap.utils.toArray(".edit__img").forEach((box) => {
      gsap.fromTo(box,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "power4.inOut",
          scrollTrigger: { trigger: box, start: "top 85%", once: true }
        });
      gsap.fromTo(box.querySelector("img"),
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true }
        });
    });
    gsap.from(".edit__text > *", {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.14, ease: "power3.out",
      scrollTrigger: { trigger: ".edit__text", start: "top 80%", once: true }
    });

    /* dark spotlight */
    gsap.utils.toArray(".spot__row").forEach((row) => {
      gsap.from(row.querySelectorAll(".spot__copy > *"), {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 70%", once: true }
      });
      gsap.fromTo(row.querySelector(".spot__bg"),
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true }
        });
    });
  }

  /* ======================================================
     NEW: FEATURED PRODUCT, CTA, FOOTER
  ====================================================== */

  /* ------------------------------------------------------
     12. FEATURED PRODUCT – gallery swap, size select, add to bag
  ------------------------------------------------------ */
  const pdpMain = document.getElementById("pdpMain");
  const pdpThumbs = document.querySelectorAll("#pdpThumbs button");
  let pdpBusy = false;

  pdpThumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (pdpBusy || btn.classList.contains("is-active")) return;
      pdpBusy = true;
      pdpThumbs.forEach((b) => b.classList.toggle("is-active", b === btn));

      const nextSrc = btn.dataset.img;
      const preload = new Image();
      preload.onload = preload.onerror = () => {
        gsap.timeline({ onComplete: () => { pdpBusy = false; } })
          .to(pdpMain, { opacity: 0, scale: 1.04, duration: 0.3, ease: "power2.in" })
          .add(() => { pdpMain.src = nextSrc; })
          .to(pdpMain, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" });
      };
      preload.src = nextSrc;
    });
  });

  const sizeBtns = document.querySelectorAll("#pdpSizes button");
  const pdpMsg = document.getElementById("pdpMsg");
  let chosenSize = null;

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      chosenSize = btn.textContent.trim();
      sizeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      pdpMsg.textContent = "";
      gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    });
  });

  const pdpAdd = document.getElementById("pdpAdd");
  pdpAdd.addEventListener("click", () => {
    const label = pdpAdd.querySelector("span");

    if (!chosenSize) {
      pdpMsg.textContent = "Choose a size to add this to your bag.";
      gsap.fromTo("#pdpSizes", { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.35)", clearProps: "x" });
      return;
    }

    pdpMsg.textContent = "";
    bagCount.textContent = parseInt(bagCount.textContent, 10) + 1;
    gsap.fromTo(".bag b", { scale: 1.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });

    label.textContent = "Added to bag (" + chosenSize + ")";
    setTimeout(() => { label.textContent = "Add to bag"; }, 1600);
  });

  /* ------------------------------------------------------
     13. CTA – newsletter form feedback
  ------------------------------------------------------ */
  const ctaForm = document.getElementById("ctaForm");
  const ctaEmail = document.getElementById("ctaEmail");
  const ctaNote = document.getElementById("ctaNote");

  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ctaEmail.value.trim());

    if (!ok) {
      ctaNote.textContent = "Enter a valid email address, like name@example.com.";
      gsap.fromTo(ctaForm, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.35)", clearProps: "x" });
      ctaEmail.focus();
      return;
    }

    ctaNote.textContent = "You're on the list. Check your inbox for a confirmation.";
    ctaForm.reset();
    gsap.fromTo(ctaNote, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
  });

  /* ------------------------------------------------------
     14. SCROLL REVEALS – product, CTA, footer
  ------------------------------------------------------ */
  if (hasST) {
    /* product: image curtain + parallax, info stagger */
    const pdpBox = document.querySelector(".pdp__main");
    gsap.fromTo(pdpBox,
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".pdp__gallery", start: "top 82%", once: true }
      });
    gsap.from(".pdp__thumbs li", {
      x: -30, opacity: 0, duration: 0.8, stagger: 0.09, ease: "power3.out",
      scrollTrigger: { trigger: ".pdp__gallery", start: "top 78%", once: true }
    });
    gsap.from(".pdp__info > *", {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".pdp__info", start: "top 80%", once: true }
    });

    /* CTA: card rises in, image parallax */
    gsap.from(".cta__card", {
      y: 80, opacity: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: ".cta__card", start: "top 88%", once: true }
    });
    gsap.from(".cta__copy > *", {
      y: 36, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.2, ease: "power3.out",
      scrollTrigger: { trigger: ".cta__card", start: "top 80%", once: true }
    });
    gsap.fromTo(".cta__img img",
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".cta__img", start: "top bottom", end: "bottom top", scrub: true }
      });

    /* footer: columns fade in, giant wordmark slides up from its mask */
    gsap.from(".ftr__top > *", {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".ftr", start: "top 85%", once: true }
    });
    gsap.from(".ftr__mark span", {
      yPercent: 105, duration: 1.4, ease: "power4.out",
      scrollTrigger: { trigger: ".ftr__mark", start: "top 95%", once: true }
    });
  }
});