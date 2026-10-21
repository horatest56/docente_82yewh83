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


