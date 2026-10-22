
"use strict";

/*==========================================================
    MODAL
==========================================================*/

const modal = document.getElementById("modal");
const imagenModal = document.getElementById("imagenModal");
const cerrar = document.getElementById("cerrar");
const galeria = document.getElementById("galeria");
const tituloModal = document.getElementById("tituloModal");
const textoModal = document.getElementById("textoModal");
const infoModal = document.getElementById("infoModal");


/*==========================================================
    CLICK SOBRE LAS FOTOS DEL ALBUM
==========================================================*/

galeria.addEventListener("click", function(event) {
    const foto = event.target.closest(".foto");

    if (!foto) return;

    abrirModal(event);
});


/*==========================================================
    CERRAR MODAL
==========================================================*/

cerrar.addEventListener("click", cerrarModal);

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        cerrarModal();
    }
});


/*==========================================================
    ABRIR MODAL
==========================================================*/

function abrirModal(event) {
    const foto = event.target.closest(".foto");

    if (!foto) return;

    const card = foto.closest(".card");

    imagenModal.src = foto.src;
    imagenModal.alt = foto.alt;

    tituloModal.textContent =
        card.querySelector(".texto").textContent.trim();

    textoModal.innerHTML =
        card.querySelector(".descripcion").innerHTML.trim();

    modal.classList.add("abierto");

    const hayTitulo = tituloModal.textContent.trim() !== "";
    const hayTexto = textoModal.textContent.trim() !== "";

    infoModal.style.display =
        (!hayTitulo && !hayTexto) ? "none" : "block";

    restablecerZoom();
}


/*==========================================================
    CERRAR MODAL
==========================================================*/

function cerrarModal() {
    modal.classList.remove("abierto");

    if (document.fullscreenElement === imagenModal) {
        document.exitFullscreen();
    }

    restablecerZoom();
}


/*==========================================================
    ZOOM Y DESPLAZAMIENTO
==========================================================*/

let escala = 1;
let desplazamientoX = 0;
let desplazamientoY = 0;

let puntos = new Map();
let distanciaInicial = 0;
let escalaInicial = 1;
let movimiento = false;
let gestoMultiple = false;
let posicionX = 0;
let posicionY = 0;

function restablecerZoom() {
    escala = 1;
    desplazamientoX = 0;
    desplazamientoY = 0;
    imagenModal.style.transform = "none";
}

function actualizarZoom() {
    imagenModal.style.transform =
        `translate(${desplazamientoX}px, ${desplazamientoY}px) scale(${escala})`;
}

function distanciaEntre(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}


/*==========================================================
    INICIO DEL GESTO
==========================================================*/

imagenModal.addEventListener("pointerdown", function(event) {

    // Fuera de pantalla completa, el clic se procesa al soltar.
    if (document.fullscreenElement !== imagenModal) return;

    event.preventDefault();

    puntos.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    if (puntos.size >= 2) {
        gestoMultiple = true;
        movimiento = true;

        const p = [...puntos.values()];

        distanciaInicial = distanciaEntre(p[0], p[1]);
        escalaInicial = escala;
    } else {
        posicionX = event.clientX;
        posicionY = event.clientY;
        movimiento = false;
    }

    imagenModal.setPointerCapture(event.pointerId);
});


/*==========================================================
    MOVIMIENTO: ZOOM O DESPLAZAMIENTO
==========================================================*/

imagenModal.addEventListener("pointermove", function(event) {

    if (document.fullscreenElement !== imagenModal) return;
    if (!puntos.has(event.pointerId)) return;

    event.preventDefault();

    const anterior = puntos.get(event.pointerId);

    puntos.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    if (puntos.size >= 2) {
        const p = [...puntos.values()];
        const distanciaActual = distanciaEntre(p[0], p[1]);

        if (distanciaInicial > 0) {
            escala = Math.max(
                1,
                Math.min(
                    5,
                    escalaInicial * distanciaActual / distanciaInicial
                )
            );
        }

        actualizarZoom();
        return;
    }

    const dx = event.clientX - anterior.x;
    const dy = event.clientY - anterior.y;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        movimiento = true;
    }

    if (escala > 1) {
        desplazamientoX += dx;
        desplazamientoY += dy;
        actualizarZoom();
    } else if (
        Math.abs(event.clientX - posicionX) > 8 ||
        Math.abs(event.clientY - posicionY) > 8
    ) {
        movimiento = true;
    }
});


/*==========================================================
    FIN DEL GESTO
==========================================================*/

imagenModal.addEventListener("pointerup", finalizarGesto);
imagenModal.addEventListener("pointercancel", finalizarGesto);

function finalizarGesto(event) {

    // Un clic o toque en el MODAL entra en pantalla completa.
    if (document.fullscreenElement !== imagenModal) {
        if (event.type === "pointerup") {
            restablecerZoom();

            imagenModal.requestFullscreen().catch(error => {
                console.error("No se pudo entrar en pantalla completa:", error);
            });
        }

        return;
    }

    if (!puntos.has(event.pointerId)) return;

    puntos.delete(event.pointerId);

    // Si queda otro dedo apoyado, no finalizar todavía.
    if (puntos.size > 0) {
        gestoMultiple = true;
        return;
    }

    // Un toque sin movimiento vuelve al MODAL.
    if (!movimiento && !gestoMultiple && event.type === "pointerup") {
        document.exitFullscreen();
    }

    puntos.clear();
    distanciaInicial = 0;
    movimiento = false;
    gestoMultiple = false;
}


/*==========================================================
    CAMBIOS DE PANTALLA COMPLETA
==========================================================*/

document.addEventListener("fullscreenchange", function() {

    restablecerZoom();

    puntos.clear();
    distanciaInicial = 0;
    movimiento = false;
    gestoMultiple = false;
});
