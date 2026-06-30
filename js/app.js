/* ELEMENTOS HTML */

(function () {

    const paletaColores = document.getElementById("paleta-colores");

    const btnGenerar = document.getElementById("btn-generar");

    const mensajeTip = document.getElementById("mensaje-tip");

    const botonesCantidad = document.querySelectorAll(".botones-cantidad button");

    const formatos = document.querySelectorAll('input[name="formato"]');



    /* VARIABLES */

    let colores = [];
    let bloqueados = [];
    let cantidadActual = 6;
    let formatoActual = "HSL";

    function mostrarTip(texto) {
        mensajeTip.textContent = texto;
        mensajeTip.style.opacity = "1";
        setTimeout(() => {
            mensajeTip.style.opacity = "0";
        }, 2000);
    }


    /* GENERAR COLOR HEX */

    function generarColorHex() {
        const caracteres = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += caracteres[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function generarColorHsl() {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 50) + 40; // 40-89%
        const l = Math.floor(Math.random() * 40) + 30; // 30-69%
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    /* CONVERSIONES */

function hslAHex(hsl) {
    const valores = hsl.match(/\d+/g);
    let h = Number(valores[0]);
    let s = Number(valores[1]) / 100;
    let l = Number(valores[2]) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    ).toUpperCase();

}

function hexAHsl(hex) {

    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    let s;
    const l = (max + min) / 2;
    if (max === min) {
        h = 0;
        s = 0;
    } else {
        const d = max - min;
        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            default:
                h = ((r - g) / d + 4);
        }
        h *= 60;
    }
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}


    /* GENERAR PALETA */

    function generarPaleta(cantidad) {
    while (colores.length < cantidad) {
        colores.push("");
        bloqueados.push(false);
    }
    for (let i = 0; i < cantidad; i++) {
        if (bloqueados[i]) continue;
        colores[i] =
            formatoActual === "HEX"
                ? generarColorHex()
                : generarColorHsl();
    }
    colores = colores.slice(0, cantidad);
    bloqueados = bloqueados.slice(0, cantidad);
}


    /* RENDERIZAR TARJETAS */

function renderizarColores() {
    let html = "";
    colores.forEach((color, index) => {
        let texto = color;
        if (formatoActual === "HEX" && color.startsWith("hsl")) {
            texto = hslAHex(color);
        }
        if (formatoActual === "HSL" && color.startsWith("#")) {
            texto = hexAHsl(color);
        }
        html += `
        <article class="tarjeta-color">
            <div
                class="preview-color"
                style="background:${color}">
                <button
                    type="button"
                    class="btn-bloquear ${bloqueados[index] ? "bloqueado" : ""}">
                    ${bloqueados[index] ? "🔒" : "🔓"}
                </button>
            </div>

            <div class="info-color">
                <span>${texto}</span>
                <button
                    type="button"
                    class="btn-copiar">
                    Copiar
                </button>
            </div>
        </article>
        `;
    });
    paletaColores.innerHTML = html;
}

    /* BOTONES COPIAR */

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest('.btn-copiar');
        if (!btn) return;
        const info = btn.closest('.info-color');
        if (!info) return;
        const color = info.querySelector('span')?.textContent || '';
        if (!color) return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(color);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = color;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            mostrarTip('Color copiado correctamente');
        } catch (err) {
            mostrarTip('No se pudo copiar el color');
            console.error('Error copiando al portapapeles:', err);
        }
    });


    /* BOTON GENERAR */

    btnGenerar.addEventListener("click", () => {
        generarPaleta(cantidadActual);
        renderizarColores();
        mostrarTip("Nueva paleta generada");
    });


    /* INICIO */

    generarPaleta(cantidadActual);

    renderizarColores();

    /* BOTONES CANTIDAD */

    botonesCantidad.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesCantidad.forEach(btn => {
                btn.classList.remove("activo");
            });
            boton.classList.add("activo");
            cantidadActual =
                Number(boton.textContent);
            generarPaleta(cantidadActual);
            renderizarColores();
        });
    });



    /* FORMATOS */

formatos.forEach(radio => {
    radio.addEventListener("change", () => {
        document
            .querySelectorAll(".opciones-formato label")
            .forEach(label => {
                label.classList.remove("activo-formato");
            });
        radio.parentElement.classList.add("activo-formato");
        formatoActual = radio.value;
        renderizarColores();
        mostrarTip(`Formato ${formatoActual} activado`);
    });
});



/* BOTONES BLOQUEAR */

document.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-bloquear");
    if (!boton) return;
    const tarjeta = boton.closest(".tarjeta-color");
    const indice = [...document.querySelectorAll(".tarjeta-color")]
        .indexOf(tarjeta);
    bloqueados[indice] = !bloqueados[indice];
    renderizarColores();
});

})();
