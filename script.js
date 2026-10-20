
const articles = window.ARTICLES || [];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

let active = "Todos";

function render() {
  if (!grid || !search || !empty) return;

  const q = search.value.toLowerCase().trim();

  const list = articles.filter(a =>
    (active === "Todos" || a.category === active) &&
    (a.title + " " + a.excerpt + " " + a.category)
      .toLowerCase().includes(q)
  );

  grid.innerHTML = list.map(a => `
    <article class="card">
      <a href="articulo.html?id=${encodeURIComponent(a.id)}"
         class="article-image">
        <div class="art">
          <img src="${a.image}" alt="${a.title}" loading="lazy">
          <small>${a.category.toUpperCase()}</small>
        </div>
      </a>

      <div class="bodycard">
        <div class="meta">
          <span class="pill">${a.category}</span>
          ${a.read} de lectura
        </div>
        <h3>
          <a href="articulo.html?id=${encodeURIComponent(a.id)}">
            ${a.title}
          </a>
        </h3>
        <p>${a.excerpt}</p>
        <a class="read"
           href="articulo.html?id=${encodeURIComponent(a.id)}">
          Leer artículo completo →
        </a>
      </div>
    </article>
  `).join("");

  empty.hidden = list.length > 0;
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    active = button.dataset.filter;
    render();

    document.querySelectorAll("[data-filter]").forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.filter === active
      );
    });
  });
});

document.querySelectorAll("[data-side]").forEach(button => {
  button.addEventListener("click", () => {
    active = button.dataset.side;
    render();
  });
});

if (search) search.addEventListener("input", render);

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.getElementById("menubtn");
const nav = document.getElementById("nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

render();


