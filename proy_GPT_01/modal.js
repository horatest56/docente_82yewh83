"use strict";

/*==========================================================

    MODAL

==========================================================*/

const modal = document.getElementById("modal");

const imagenModal = document.getElementById("imagenModal");

const cerrar = document.getElementById("cerrar");

const fotos = document.querySelectorAll(".foto");

const tituloModal =
    document.getElementById("tituloModal");

const textoModal =
    document.getElementById("textoModal");



for (const foto of fotos){

    foto.addEventListener("click", abrirModal);

}



cerrar.addEventListener("click", cerrarModal);



modal.addEventListener("click", function(event){

    if(event.target === modal){

        cerrarModal();

    }

});



function abrirModal(event){

    const card = event.currentTarget.closest(".card");

    imagenModal.src = event.currentTarget.src;

    imagenModal.alt = event.currentTarget.alt;

    tituloModal.textContent =
        card.querySelector(".texto").textContent.trim();

    textoModal.textContent =
        card.querySelector(".descripcion").textContent.trim();

    modal.classList.add("abierto");

console.log(window.innerWidth);
console.log(window.innerHeight);
console.log(imagenModal.clientWidth);
console.log(imagenModal.clientHeight);

}

function cerrarModal(){

    modal.classList.remove("abierto");

}

