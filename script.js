document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-articulos");
    const pestañas = document.querySelectorAll(".tab-categoria");

    function mostrarArticulos(categoriaFiltrada = "Todos") {
        if (!contenedor) return;
        contenedor.innerHTML = "";

        const articulosFiltrados = articulos.filter(art => 
            categoriaFiltrada === "Todos" || art.categoria === categoriaFiltrada
        );

        if (articulosFiltrados.length === 0) {
            contenedor.innerHTML = `<p class="no-articles">No se encontraron artículos en esta categoría.</p>`;
            return;
        }

        articulosFiltrados.forEach(art => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-articulo";
            tarjeta.innerHTML = `
                <div class="tarjeta-tag">${art.categoria}</div>
                <h3>${art.titulo}</h3>
                <p class="tarjeta-fecha">${art.fecha}</p>
                <p class="tarjeta-resumen">${art.resumen}</p>
                <a href="articulo.html?id=${art.id}" class="btn-leer">Leer artículo →</a>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    pestañas.forEach(tab => {
        tab.addEventListener("click", (e) => {
            pestañas.forEach(t => t.classList.remove("active"));
            e.target.classList.add("active");
            mostrarArticulos(e.target.dataset.categoria);
        });
    });

    mostrarArticulos();
});
