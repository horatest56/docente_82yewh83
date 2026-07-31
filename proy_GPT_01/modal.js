"use strict";

/*==========================================================

    MODAL

==========================================================*/

const modal = document.getElementById("modal");

const imagenModal = document.getElementById("imagenModal");

const cerrar = document.getElementById("cerrar");

const fotos = document.querySelectorAll(".foto");



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

 /*   imagenModal.src = event.target.src;  */
	const foto = event.currentTarget;

	imagenModal.src = foto.src;
	imagenModal.alt = foto.alt;

    imagenModal.alt = event.target.alt;

    modal.classList.add("abierto");

}



function cerrarModal(){

    modal.classList.remove("abierto");

}

