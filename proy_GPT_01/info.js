"use strict";


/*==========================================================
    ELEMENTOS
==========================================================*/

const modalInfo =
    document.getElementById("modalInfo");


const contenidoModalInfo =
    document.getElementById("contenidoModalInfo");


const cerrarInfo =
    document.getElementById("cerrarInfo");


const imagenInfo =
    document.getElementById("imagenInfo");


const tituloInfo =
    document.getElementById("tituloInfo");


const descripcionInfo =
    document.getElementById("descripcionInfo");


const fechaInfo =
    document.getElementById("fechaInfo");


const ubicacionInfo =
    document.getElementById("ubicacionInfo");


const mapaInfo =
    document.getElementById("mapaInfo");



/*==========================================================
    CLICK SOBRE BOTÓN "i"
==========================================================*/

document
    .getElementById("galeria")
    .addEventListener("click", function(event) {


        const boton =
            event.target.closest(".botonInfo");


        if (!boton) {
            return;
        }


        const card =
            boton.closest(".card");


        const foto =
            card.querySelector(".foto");


        const titulo =
            card.querySelector(".texto")
                .textContent
                .trim();


        const descripcion =
            card.querySelector(".descripcion")
                .innerHTML
                .trim();


        abrirInfo(
            foto,
            titulo,
            descripcion
        );

    });



/*==========================================================
    ABRIR MODAL INFORMACIÓN
==========================================================*/

async function abrirInfo(
    foto,
    titulo,
    descripcion
) {


    /*----------------------------------------------
        FOTO
    ----------------------------------------------*/

    imagenInfo.src =
        foto.src;

    imagenInfo.alt =
        foto.alt;


    /*----------------------------------------------
        TÍTULO
    ----------------------------------------------*/

    tituloInfo.textContent =
        titulo;


    /*----------------------------------------------
        DESCRIPCIÓN
    ----------------------------------------------*/

    descripcionInfo.innerHTML =
        descripcion;


    /*----------------------------------------------
        VALORES INICIALES
    ----------------------------------------------*/

    fechaInfo.textContent =
        "Leyendo metadatos...";


    ubicacionInfo.textContent =
        "Buscando ubicación...";


    mapaInfo.innerHTML =
        "";


    /*----------------------------------------------
        MOSTRAR MODAL
    ----------------------------------------------*/

    modalInfo.classList.add("abierto");


    /*----------------------------------------------
        LEER EXIF
    ----------------------------------------------*/

    try {

        const exif =
            await exifr.parse(
                foto.src,
                {
                    tiff: true,
                    exif: true,
                    gps: true
                }
            );


        procesarEXIF(exif);

    }
    catch(error) {

        console.error(
            "Error leyendo EXIF:",
            error
        );


        fechaInfo.textContent =
            "No se pudieron leer los metadatos.";

        ubicacionInfo.textContent =
            "No disponible.";

    }

}



/*==========================================================
    PROCESAR EXIF
==========================================================*/

function procesarEXIF(exif) {


    if (!exif) {

        fechaInfo.textContent =
            "No hay metadatos EXIF.";

        ubicacionInfo.textContent =
            "No disponible.";

        return;

    }


    /*----------------------------------------------
        FECHA / HORA
    ----------------------------------------------*/

    const fecha =
        exif.DateTimeOriginal ||
        exif.CreateDate ||
        exif.ModifyDate;


    if (fecha) {

        fechaInfo.textContent =
            formatearFecha(fecha);

    }
    else {

        fechaInfo.textContent =
            "No disponible.";

    }


    /*----------------------------------------------
        GPS
    ----------------------------------------------*/

    const lat =
        exif.latitude;

    const lon =
        exif.longitude;


    if (
        typeof lat === "number" &&
        typeof lon === "number"
    ) {

        ubicacionInfo.textContent =
            lat.toFixed(6) +
            ", " +
            lon.toFixed(6);


        mostrarMapa(lat, lon);

    }
    else {

        ubicacionInfo.textContent =
            "La fotografía no contiene ubicación GPS.";

    }

}



/*==========================================================
    FECHA
==========================================================*/

function formatearFecha(fecha) {

    if (fecha instanceof Date) {

        return fecha.toLocaleString(
            "es-AR"
        );

    }


    return fecha.toString();

}



/*==========================================================
    MAPA
==========================================================*/

function mostrarMapa(lat, lon) {


    const delta = 0.01;


    const bbox =
        (lon - delta) + "," +
        (lat - delta) + "," +
        (lon + delta) + "," +
        (lat + delta);


    const url =
        "https://www.openstreetmap.org/export/embed.html" +
        "?bbox=" + encodeURIComponent(bbox) +
        "&layer=mapnik" +
        "&marker=" + lat + "," + lon;


    mapaInfo.innerHTML = `

        <iframe
            src="${url}"
            loading="lazy"
            title="Ubicación de la fotografía">
        </iframe>

    `;

}



/*==========================================================
    CERRAR
==========================================================*/

cerrarInfo.addEventListener(
    "click",
    cerrarModalInfo
);


modalInfo.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modalInfo
        ) {

            cerrarModalInfo();

        }

    }
);



function cerrarModalInfo() {

    modalInfo.classList.remove(
        "abierto"
    );

}