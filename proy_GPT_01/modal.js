"use strict";

/*==========================================================

    MODAL

==========================================================*/

const modal = document.getElementById("modal");

const imagenModal =
    document.getElementById("imagenModal");

const cerrar =
    document.getElementById("cerrar");

const galeria =
    document.getElementById("galeria");

const tituloModal =
    document.getElementById("tituloModal");

const textoModal =
    document.getElementById("textoModal");

const infoModal =
    document.getElementById("infoModal");



/*==========================================================
    
    CLICK SOBRE LAS FOTOS

==========================================================*/

galeria.addEventListener("click", function(event) {

    const foto = event.target.closest(".foto");

    if (!foto) {
        return;
    }

    abrirModal(event);

});



/*==========================================================
    
    CERRAR MODAL

==========================================================*/

/* imagenModal.addEventListener("click", cerrarModal); */


cerrar.addEventListener("click", cerrarModal);


modal.addEventListener("click", function(event){

    if(event.target === modal){

        cerrarModal();

    }

});


/*==========================================================
    
    CLICK SOBRE LA IMAGEN DEL MODAL

==========================================================*/

imagenModal.addEventListener("click",manejarClickImagen);


function manejarClickImagen() {

    if (document.fullscreenElement) {

        document.exitFullscreen();

    } else {

        imagenModal.requestFullscreen();

    }

}


/*==========================================================
    
    ABRIR MODAL

==========================================================*/

function abrirModal(event){

    const foto = event.target.closest(".foto");

    if (!foto) {
        return;
    }

    const card =
        foto.closest(".card");


    imagenModal.src =
        foto.src;

    imagenModal.alt =
        foto.alt;


    tituloModal.textContent =
        card.querySelector(".texto")
            .textContent
            .trim();


    textoModal.innerHTML =
        card.querySelector(".descripcion")
            .innerHTML
            .trim();


    modal.classList.add("abierto");


    const hayTitulo =
        tituloModal.textContent.trim() !== "";


    const hayTexto =
        textoModal.textContent.trim() !== "";


    if (!hayTitulo && !hayTexto) {

        infoModal.style.display = "none";

    } else {

        infoModal.style.display = "block";

    }

}



/*==========================================================
    
    CERRAR MODAL

==========================================================*/

function cerrarModal(){

    modal.classList.remove("abierto");

}


/*==========================================================
    PANTALLA COMPLETA Y ZOOM TÁCTIL
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

function manejarInicio(e) {
    if (!document.fullscreenElement) return;

    e.preventDefault();

    puntos.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (puntos.size >= 2) {
        gestoMultiple = true;
        movimiento = true;

        const p = [...puntos.values()];
        distanciaInicial = distanciaEntre(p[0], p[1]);
        escalaInicial = escala;
    } else {
        posicionX = e.clientX;
        posicionY = e.clientY;
        movimiento = false;
    }

    imagenModal.setPointerCapture(e.pointerId);
}

function manejarMovimiento(e) {
    if (!document.fullscreenElement ||
        !puntos.has(e.pointerId)) return;

    e.preventDefault();

    const anterior = puntos.get(e.pointerId);
    puntos.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (puntos.size >= 2) {
        const p = [...puntos.values()];
        const distanciaActual = distanciaEntre(p[0], p[1]);

        if (distanciaInicial > 0) {
            escala = Math.max(
                1,
                Math.min(5, escalaInicial *
                    distanciaActual / distanciaInicial)
            );
        }

        actualizarZoom();
        return;
    }

    if (escala > 1) {
        const dx = e.clientX - anterior.x;
        const dy = e.clientY - anterior.y;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            movimiento = true;
        }

        desplazamientoX += dx;
        desplazamientoY += dy;
        actualizarZoom();
    } else if (
        Math.abs(e.clientX - posicionX) > 8 ||
        Math.abs(e.clientY - posicionY) > 8
    ) {
        movimiento = true;
    }
}

function manejarFin(e) {
    if (!puntos.has(e.pointerId)) return;

    puntos.delete(e.pointerId);

    if (puntos.size === 1) {
        // Después de pellizcar, no interpretar el dedo restante
        // como un toque para salir.
        gestoMultiple = true;
        return;
    }

    if (puntos.size > 0) return;

    if (!movimiento && !gestoMultiple) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    puntos.clear();
    distanciaInicial = 0;
    movimiento = false;
    gestoMultiple = false;
}

imagenModal.addEventListener("pointerdown", manejarInicio);
imagenModal.addEventListener("pointermove", manejarMovimiento);
imagenModal.addEventListener("pointerup", manejarFin);
imagenModal.addEventListener("pointercancel", manejarFin);

/* Al entrar en pantalla completa, empezar sin zoom */

document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement === imagenModal) {
        restablecerZoom();
    } else {
        restablecerZoom();
        puntos.clear();
        movimiento = false;
        gestoMultiple = false;
    }
});

