document.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById("calendar-body");
    if (c) {
        const h = new Date(), p = new Date(h.getFullYear(), h.getMonth(), 1).getDay(), t = new Date(h.getFullYear(), h.getMonth() + 1, 0).getDate(); let s = "<tr>", d = p === 0 ? 6 : p - 1; for (let i = 0; i < d; i++)s += "<td></td>"; for (let n = 1; n <= t; n++) { if (d === 7) { s += "</tr><tr>"; d = 0 } s += "<td" + (n === h.getDate() ? " class='hoy'" : "") + ">" + n + "</td>"; d++ } c.innerHTML = s + "</tr>";
        const m = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]; document.getElementById("mes-cal").textContent = m[h.getMonth()] + " " + h.getFullYear()
    }
    const f = document.getElementById("form-buscar"); if (f) f.addEventListener("submit", e => { e.preventDefault(); location.href = "index.html?q=" + encodeURIComponent(f.q.value) });
    const q = (new URLSearchParams(location.search).get("q") || "").toLowerCase();
    if (q) { document.querySelectorAll(".tarjeta-articulo").forEach(a => { a.style.display = a.textContent.toLowerCase().includes(q) ? "" : "none" }); const i = document.querySelector("input[name=q]"); if (i) i.value = q }
});
