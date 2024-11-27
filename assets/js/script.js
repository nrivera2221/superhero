$('document').ready(function(){
    // Verificar que lo ingresado en el input text sean solo números
$('#boton').on('click', function() {
    let input = $('#buscar').val(); //campurar lo ingresado
    //validar que el valor ingresado sea verdadero o falso
    if (!validarInput(input)) {
        //si es falso muestra un mensaje de erro debajo del input
        $('.mensaje').append('<p>Ingrese un número válido entre el 1 y el 731</p>');
    } else {
        //si es verdadero ingresa a las funciones correspondientes y añade la clase hidden
        $('.buscador-img').addClass('hidden');
        $('.buscador-title').addClass('hidden');
        document.getElementById('results-section').style.display = 'block'
        conexionApi(input);
    }
});

// Función para validar que lo ingresado sea un número dentro del rango permitido
function validarInput(input) {
    $('.mensaje').empty();
    const regex = /^\d+$/; // Expresión regular para verificar si el número ingresado es entero
    let valido = true;
    if (regex.test(input)) {
        let num = parseInt(input, 10);
        // Verifica que el número esté en el rango de 1 a 731
        if (num < 1 || num > 731) { //los numeros van en este rango ya que son los numeros que estan en la api
            valido = false;
        }
    } else {
        valido = false;
    }
    return valido; //retorna la variable valido
}

// Función para hacer la solicitud a la API
function conexionApi(input) {
    $.ajax({
        url: 'https://superheroapi.com/api.php/4905856019427443/' + input, // URL de la API
        type: 'GET', // Tipo de solicitud (GET, POST, etc.)
        dataType: 'json', // Tipo de datos esperados
        beforeSend: function() {
            $('#loading').show(); // Muestra el GIF de carga
        },
        success: function(response) {
            // Manejar la respuesta de la API
            console.log('Datos recibidos:', response);
            manejarRespuesta(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores
            console.error('Error al hacer la solicitud:', textStatus, errorThrown);
        },
        complete: function() {
            $('#loading').hide(); // Oculta el GIF de carga
        }
    });
}

// Función para manejar la respuesta de la API
function manejarRespuesta(response) {
    $(".post-container").empty(); //se utiliza en jQuery para eliminar todo el contenido HTML dentro del elemento seleccionado
    //agrega el contenido a una card
    $('.post-container').append(`
        <div class="post-card">
            <div class="card mb-3" id="card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${response.image.url}" class="img-fluid rounded-start" alt="${response.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Nombre: ${response.name}</h5>
                            <p class="card-text">Publicado por: ${response.biography.publisher} </p>
                            <p class="card-text">Primera aparición: ${response.biography['first-appearance']} </p>
                            <p class="card-text">Ocupación: ${response.work.occupation}</p>
                            <p class="card-text">Conexiones: ${response.connections['group-affiliation']} - ${response.connections.relatives || 'No disponible'}</p>
                            <p class="card-text">Alias: ${response.biography.aliases}</p>
                            <p class="card-text">Características:</p>
                            <ul>
                                <li>Género: ${response.appearance.gender}</li>
                                <li>Raza: ${response.appearance.race}</li>
                                <li>Altura: ${response.appearance.height}</li>
                                <li>Peso: ${response.appearance.weight}</li>
                                <li>Color de ojos: ${response.appearance['eye-color']}</li>
                                <li>Color de cabello: ${response.appearance['hair-color']}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    //pasa el arreglo de poderes y el nombre del super heroe 
    graficoPoder(response.powerstats, response.name);
}

// Función para crear el gráfico de torta
function graficoPoder(poderes, nombre) {
    $(document).ready(function() {
        // Convertimos los datos de powerstats en un formato adecuado para el gráfico
        var dataPoints = Object.keys(poderes).map(power => {
            return { label: power, y: poderes[power] };
        });
        var options = {
            title: {
                text: `Super poderes de ${nombre}` // Título del gráfico
            },
            data: [{
                type: "pie", // Tipo de gráfico: pie (torta)
                startAngle: 45, // Ángulo inicial del gráfico
                showInLegend: true, // Mostrar la leyenda
                legendText: "{label}", // Texto de la leyenda
                indexLabel: "{label} ({y})", // Texto de las etiquetas de los segmentos
                yValueFormatString: "#,##0.#", // Formato de los valores en el gráfico
                dataPoints: dataPoints // Los datos que se mostrarán en el gráfico
            }]
        };

        // Crear el gráfico en el contenedor con el id 'chartContainer'
        $("#chartContainer").CanvasJSChart(options);
    });
}
});