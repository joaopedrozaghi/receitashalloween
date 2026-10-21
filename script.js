// Contagem regressiva: expira à meia-noite do próximo dia 31/10
(function () {
  var el = document.getElementById("countdown");
  if (!el) return;

  function nextDeadline() {
    var now = new Date();
    // Define o alvo para o dia 31/10 deste ano às 23:59:59
    var target = new Date(now.getFullYear(), 9, 31, 23, 59, 59);
    // Se já passou, usa o ano seguinte
    if (target.getTime() < now.getTime()) {
      target = new Date(now.getFullYear() + 1, 9, 31, 23, 59, 59);
    }
    return target;
  }

  var deadline = nextDeadline();

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    var now = new Date().getTime();
    var diff = deadline.getTime() - now;

    if (diff <= 0) {
      el.textContent = "00:00:00";
      return;
    }

    var totalHours = Math.floor(diff / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    el.textContent = pad(totalHours) + ":" + pad(minutes) + ":" + pad(seconds);
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
