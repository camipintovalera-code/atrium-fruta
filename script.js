
const articles = [
  {
    category: "Free Fire",
    title: "Cómo aprovechar los eventos de Free Fire",
    excerpt: "Conoce los eventos, las recompensas y las recomendaciones para jugar con seguridad.",
    image: "https://ginica.streamfocus.lat/wp-content/uploads/2025/11/IMG_7787-300x200.png",
    url: "eventos-oficiales.html"
  },
  {
    category: "Free Fire",
    title: "Diamantes en Free Fire: qué debes saber",
    excerpt: "Infórmate antes de comprar diamantes y evita páginas sospechosas.",
    image: "https://ginica.streamfocus.lat/wp-content/uploads/2025/12/recargar-diamantes-free-fire-300x176.jpg",
    url: "diamantes-seguros.html"
  },
  {
    category: "Guías",
    title: "Cómo mejorar tu precisión en Free Fire",
    excerpt: "Aprende sobre la sensibilidad y la configuración de los controles.",
    image: "https://ginica.streamfocus.lat/wp-content/uploads/2025/12/maxresdefault-31-300x169.jpg",
    url: "consejos-principiantes.html"
  },
  {
    category: "Guías",
    title: "Cómo subir a Heroico en Free Fire",
    excerpt: "Consejos para mejorar tu rendimiento y avanzar de rango.",
    image: "https://ginica.streamfocus.lat/wp-content/uploads/2025/12/maxresdefault-30-300x169.jpg",
    url: "rendimiento-movil.html"
  },
  {
    category: "Novedades",
    title: "Códigos y recompensas de Free Fire",
    excerpt: "Aprende a consultar los códigos y verificar las fuentes oficiales.",
    image: "https://ginica.streamfocus.lat/wp-content/uploads/2025/12/20224281553848_1-300x157.jpg",
    url: "eventos-oficiales.html"
  },
  {
    category: "Seguridad",
    title: "Cuida tu cuenta de videojuegos",
    excerpt: "Consejos para proteger tus datos y evitar engaños.",
    image: "https://ginica.streamfocus.lat/wp-content/uploads/2025/12/maxresdefault-29-300x169.jpg",
    url: "proteger-cuenta.html"
  }
];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

let active = "Todos";

function render() {
  const q = (search.value || "").toLowerCase().trim();

  const list = articles.filter(a =>
    (active === "Todos" || a.category === active) &&
    (a.title + " " + a.excerpt + " " + a.category)
      .toLowerCase()
      .includes(q)
  );

  grid.innerHTML = list.map(a => `
    <article class="card">
      <a href="${a.url}" class="article-image">
        <div class="art">
          <img
            src="${a.image}"
            alt="${a.title}"
            loading="lazy"
            onerror="this.style.display='none'"
          >
          <small>${a.category.toUpperCase()}</small>
        </div>
      </a>
      <div class="bodycard">
        <div class="meta">
          <span class="pill">${a.category}</span>
          Guía práctica
        </div>
        <h3><a href="${a.url}">${a.title}</a></h3>
        <p>${a.excerpt}</p>
        <a class="read" href="${a.url}">Leer artículo →</a>
      </div>
    </article>
  `).join("");

  empty.hidden = list.length > 0;
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    active = button.dataset.filter;

    document.querySelectorAll(".filters button").forEach(item => {
      item.classList.toggle("active", item.dataset.filter === active);
    });

    render();
    document.getElementById("articulos").scrollIntoView({
      behavior: "smooth"
    });
  });
});

document.querySelectorAll("[data-side]").forEach(button => {
  button.addEventListener("click", () => {
    active = button.dataset.side;
    render();
  });
});

search.addEventListener("input", render);

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("menubtn").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

render();
