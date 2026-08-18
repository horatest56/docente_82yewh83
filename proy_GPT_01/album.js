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

            // Crear ARTICLE
            const card = document.createElement("article");

            card.className = "card";


            // Crear IMG
            const imagen = document.createElement("img");

            imagen.className = "foto";
            imagen.src = foto;
            imagen.alt = "Foto " + (indice + 1);


            // Crear TEXTO
            const divTexto = document.createElement("div");

            divTexto.className = "texto";
            divTexto.textContent = texto;


            // Crear DESCRIPCION
            const divDescripcion = document.createElement("div");

            divDescripcion.className = "descripcion";
            divDescripcion.textContent = descripcion;


            // Armar la CARD
            card.appendChild(imagen);
            card.appendChild(divTexto);
            card.appendChild(divDescripcion);


            // Agregar CARD al GRID
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

    return campo.trim().replace(/^"|"$/g, "");

}