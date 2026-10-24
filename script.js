// Contagem regressiva: começa em 15 minutos e reinicia ao zerar
(function () {
  var el = document.getElementById("countdown");
  if (!el) return;

  // Duração total do contador, em segundos (15 minutos)
  var DURATION = 15 * 60;

  // Mantém o tempo restante persistente na aba para não reiniciar a cada refresh
  var stored = parseInt(sessionStorage.getItem("promo_deadline"), 10);
  var deadline = (!isNaN(stored) && stored > Date.now()) ? stored : Date.now() + DURATION * 1000;
  sessionStorage.setItem("promo_deadline", deadline);

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    var diff = Math.floor((deadline - Date.now()) / 1000);

    if (diff <= 0) {
      // Reinicia o contador
      deadline = Date.now() + DURATION * 1000;
      sessionStorage.setItem("promo_deadline", deadline);
      diff = DURATION;
    }

    var minutes = Math.floor(diff / 60);
    var seconds = diff % 60;
    el.textContent = pad(minutes) + ":" + pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();

// Carrossel com dots arrastável
(function () {
  var carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    var dotsWrap = carousel.querySelector("[data-carousel-dots]");
    if (!track || !dotsWrap) return;

    var items = track.children;
    var dots = [];

    for (var i = 0; i < items.length; i++) {
      (function (index) {
        var dot = document.createElement("button");
        dot.setAttribute("aria-label", "Ir para o item " + (index + 1));
        dot.addEventListener("click", function () {
          var item = items[index];
          track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: "smooth" });
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      })(i);
    }

    function setActive() {
      var center = track.scrollLeft + track.clientWidth / 2;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemCenter = item.offsetLeft - track.offsetLeft + item.clientWidth / 2;
        var dist = Math.abs(itemCenter - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
      dots.forEach(function (d, idx) {
        d.classList.toggle("is-active", idx === best);
      });
    }

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          setActive();
          ticking = false;
        });
        ticking = true;
      }
    });

    setActive();
  });
})();
