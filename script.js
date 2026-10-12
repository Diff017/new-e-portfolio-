// ===== Mobile navigation =====
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("open"));
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 820) setOpen(false);
  });
})();

// ===== Gallery lightbox =====
(function () {
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var box = document.getElementById("lightbox");
  if (!thumbs.length || !box) return;

  var img = box.querySelector("img");
  var caption = box.querySelector(".caption");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    var t = thumbs[current];
    img.src = t.getAttribute("data-full");
    img.alt = t.getAttribute("data-title") || "";
    caption.textContent = t.getAttribute("data-title") || "";
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
    img.src = "";
    if (lastFocus) lastFocus.focus();
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      open(i);
    });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () {
    show(current - 1);
  });
  box.querySelector(".lb-next").addEventListener("click", function () {
    show(current + 1);
  });

  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // simple swipe support on phones
  var startX = null;
  box.addEventListener(
    "touchstart",
    function (e) {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  box.addEventListener(
    "touchend",
    function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(dx > 0 ? current - 1 : current + 1);
      startX = null;
    },
    { passive: true }
  );
})();
