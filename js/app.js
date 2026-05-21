/* ELEMENTOS HTML */

const paletaColores = document.getElementById("paleta-colores");

const btnGenerar = document.getElementById("btn-generar");

const mensajeTip = document.getElementById("mensaje-tip");

const botonesCantidad = document.querySelectorAll(".botones-cantidad button");

const formatos = document.querySelectorAll('input[name="formato"]');



/* VARIABLES */

let colores = [];

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
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
}


/* GENERAR PALETA */

function generarPaleta(cantidad) {
    colores = [];
    for (let i = 0; i < cantidad; i++) {
        if (formatoActual === "HEX") {
            colores.push(generarColorHex());
        } else {
            colores.push(generarColorHsl());
        }
    }
}


/* RENDERIZAR TARJETAS */

function renderizarColores() {
    paletaColores.innerHTML = "";
    colores.forEach(color => {
        paletaColores.innerHTML += `
        <article class="tarjeta-color">
            <div class="preview-color" style="background:${color}"></div>
            <div class="info-color"><span>${color}</span>
                <button class="btn-copiar">Copiar</button>
            </div>
        </article>`;
    });
}

/* BOTONES COPIAR */

document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-copiar")
    ) {
        const color =
            e.target
                .previousElementSibling
                .textContent;
        navigator.clipboard.writeText(color);
        mostrarTip("Color copiado correctamente");
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
                label.classList.remove(
                    "activo-formato"
                );
            });
        radio.parentElement.classList.add(
            "activo-formato"
        );
        formatoActual =
            radio.value;        


        /* TIP */

        mostrarTip(`Formato ${formatoActual} activado`);
    });
});