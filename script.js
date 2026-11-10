document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-articulos");
    const listaRecientes = document.getElementById("lista-recientes");
    const pestañas = document.querySelectorAll(".tab-categoria");

    function mostrarArticulos(categoriaFiltrada = "Todos") {
        if (!contenedor) return;
        contenedor.innerHTML = "";
        const filtrados = articulos.filter(art => categoriaFiltrada === "Todos" || art.categoria === categoriaFiltrada);
        
        filtrados.forEach(art => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-articulo";
            tarjeta.innerHTML = `
                <div class="tarjeta-tag">${art.categoria}</div>
                <h3>${art.titulo}</h3>
                <p class="tarjeta-fecha">📅 ${art.fecha}</p>
                <p class="tarjeta-resumen">${art.resumen}</p>
                <a href="articulo.html?id=${art.id}" class="btn-leer">Leer artículo →</a>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    function cargarRecientes() {
        if (!listaRecientes) return;
        listaRecientes.innerHTML = "";
        articulos.slice(-5).reverse().forEach(art => {
            const item = document.createElement("li");
            item.innerHTML = `<a href="articulo.html?id=${art.id}">🔹 ${art.titulo}</a>`;
            listaRecientes.appendChild(item);
        });
    }

    function generarCalendario() {
        const cuerpoCal = document.getElementById("calendar-body");
        if (!cuerpoCal) return;
        const fechaActual = new Date();
        const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
        const totalDias = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
        let html = "<tr>";
        let diaSemana = (primerDia === 0) ? 6 : primerDia - 1;
        for (let i = 0; i < diaSemana; i++) html += "<td></td>";
        for (let dia = 1; dia <= totalDias; dia++) {
            if (diaSemana === 7) { html += "</tr><tr>"; diaSemana = 0; }
            const esHoy = dia === fechaActual.getDate() ? "class='hoy'" : "";
            html += `<td ${esHoy}>${dia}</td>`;
            diaSemana++;
        }
        html += "</tr>"; cuerpoCal.innerHTML = html;
    }

    pestañas.forEach(tab => {
        tab.addEventListener("click", (e) => {
            pestañas.forEach(t => t.classList.remove("active"));
            e.target.classList.add("active");
            mostrarArticulos(e.target.dataset.categoria);
        });
    });

    mostrarArticulos(); cargarRecientes(); generarCalendario();
});
