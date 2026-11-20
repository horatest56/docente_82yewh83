"use strict";

fetch("fotos.csv")
    .then(response => {

        if (!response.ok) {
            throw new Error("No se pudo leer fotos.csv");
        }

        return response.text();

    })

    .then(csv => {

        const lineas = csv.trim().split(/\r?\n/);

        // Primera línea = encabezados
        lineas.shift();

        const galeria = document.getElementById("galeria");

        lineas.forEach((linea, indice) => {

            if (linea.trim() === "") {
                return;
            }

            // Como acordamos que NO habrá comas
            const campos = linea.split(",");

            const foto = limpiarCampo(campos[0]);
            const texto = limpiarCampo(campos[1]);
            const descripcion = limpiarCampo(campos[2]);


            /*==================================================
                CARD
            ==================================================*/

            const card = document.createElement("article");

            card.className = "card";


            /*==================================================
                CONTENEDOR DE FOTO
            ==================================================*/

            const fotoWrapper =
                document.createElement("div");

            fotoWrapper.className =
                "foto-wrapper";


            /*==================================================
                FOTO
            ==================================================*/

            const imagen =
                document.createElement("img");

            imagen.className = "foto";

            imagen.src = foto;

            imagen.alt =
                "Foto " + (indice + 1);


            /*==================================================
                BOTÓN INFORMACIÓN
            ==================================================*/

            const botonInfo =
                document.createElement("button");

            botonInfo.className =
                "botonInfo";

            botonInfo.textContent = "i";

            botonInfo.type = "button";

            botonInfo.title =
                "Información de la fotografía";


            /*==================================================
                TEXTO
            ==================================================*/

            const divTexto =
                document.createElement("div");

            divTexto.className =
                "texto";

            divTexto.textContent =
                texto;


            /*==================================================
                DESCRIPCIÓN
            ==================================================*/

            const divDescripcion =
                document.createElement("div");

            divDescripcion.className =
                "descripcion";

            // Permitimos HTML en la descripción
            divDescripcion.innerHTML =
                descripcion;


            /*==================================================
                ARMAR FOTO
            ==================================================*/

            fotoWrapper.appendChild(imagen);

            fotoWrapper.appendChild(botonInfo);


            /*==================================================
                ARMAR CARD
            ==================================================*/

            card.appendChild(fotoWrapper);

            card.appendChild(divTexto);

            card.appendChild(divDescripcion);


            /*==================================================
                AGREGAR CARD AL GRID
            ==================================================*/

            galeria.appendChild(card);

        });

    })

    .catch(error => {

        console.error("Error:", error);

    });



function limpiarCampo(campo) {

    if (!campo) {
        return "";
    }

    return campo
        .trim()
        .replace(/^"|"$/g, "");

}