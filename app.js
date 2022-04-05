// Llave para la lista de recetas
const keyRecetas = 'recetas';

// Obtener el formulario con el id 'form-recipe'
const form = document.getElementById('form-recipe');
// Obtener la seccion con el id 'view'
const view = document.getElementById('view');
// Contador para los ingredientes agregados
let contadorIngredientes = 0;

// Agregar un EventListener a 'DOMContentLoaded'
document.addEventListener('DOMContentLoaded', () => {
    // Agregar evento de 'GuardarReceta' a submit
    form.addEventListener('submit', guardarReceta);

    // Agregar evento de 'AgregarIngredientes' al boton con id 'newIng'
    document.getElementById('newIng').addEventListener('click', agregarIngrediente);

    // Muestra las recetas en 'view'
    mostrarRecetas();
});

// Funcion para guardar una receta
function guardarReceta(e) {
    e.preventDefault();

    // Crear un objeto de receta con los valores
    let receta = {
        id: Date.now(),
        titulo: form['title'].value,
        urlImg: form['img_url'].value,
        descripcion: form['description'].value,
        ingredientes: obtenerIngredientes()
    };

    // Obtener la lista de recetas y agregar la nueva receta
    let recetas = obtenerRecetas();

    // Agregar la receta al arreglo
    recetas.push(receta);

    // Almacena el arreglo nuevo en localStorage como JSON
    localStorage.setItem(keyRecetas, JSON.stringify(recetas));

    // Mostrar la receta en 'view'
    mostrarRecetas();

    // Limpiar los inputs
    form.reset();
}

// Funcion para mostrar las recetas en 'view'
function mostrarRecetas() {
    // Obtener la lista de recetas
    let recetas = obtenerRecetas();

    // Si hay recetas
    if (recetas.length > 0) {

        // Obtener el elemento con el id 'view'
        let view = document.getElementById('view');

        // Limpia el view
        view.innerHTML = '';
        
        // Crear una variable para el html y almacenar todas las cards de recetas
        let html = '';

        // Agregar el titulo h1 "Listado de recetas"
        html += `<h1 class="[ color-primary ] [ text-center ]">Listado de recetas</h1>`;
        // Grid para las cards de recetas
        html += `<div class="[ row ] [ flex ]" data-state="wrap">`;
        // Recorrer el arreglo de recetas
        recetas.forEach(receta => {
            // Crear el html del card de la receta
            html += `
                <div class="[ col ]">
                    <div class="[ card ] [ bg-secondary color-white ] [ radius shadow ]" card-id="${receta.id}">
                        <img src="${receta.urlImg}" class="recipe-img" alt="">
                        <div class="[ flow ]">
                            <h5>${receta.titulo}</h5>
                            <div class="[ flex ]" data-state="justify-between">
                                <button class="[ btn ]" data-state="white" onclick="getRecipe(${receta.id})">Ver</button>
                                <button class="[ btn ]" data-state="warning" onclick="deleteRecipe(${receta.id})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        // Cerrar el grid para las cards de recetas
        html += `</div>`;

        // Insertar el html en 'view'
        view.innerHTML = html;
    }
}

// Funcion para eliminar una receta
function deleteRecipe(id) {
    // Obtener la lista de recetas
    let recetas = obtenerRecetas();

    // Obten la receta de la lista de recetas con el id del parametro
    let receta = recetas.find(receta => receta.id == id);

    // Si encontro la receta
    if (receta) {
        // Eliminar la receta de la lista de recetas
        recetas = recetas.filter(receta => receta.id != id);

        // Almacena el arreglo nuevo en localStorage como JSON
        localStorage.setItem(keyRecetas, JSON.stringify(recetas));

        // Muestra las recetas en 'view'
        mostrarRecetas();
    }
}

// Funcion para visualizar una receta
function getRecipe(id) {
    // Obtener la lista de recetas
    const recetas = obtenerRecetas();

    // Obten la receta de la lista de recetas con el id del parametro
    const receta = recetas.find(receta => receta.id == id);

    // Si encontro la receta
    if (receta) {
        // Obtener el elemento con el id 'view'
        let view = document.getElementById('view');

        // Limpia el view
        view.innerHTML = '';

        // Crear una variable para el html y dibujar la receta individual
        let html = '';

        // Agregar el titulo h1 "Receta"
        html += `<h1 class="[ color-primary ] [ text-center ]">Receta</h1>`;

        // Card de la receta
        html += `
            <div class="[ recipe ] [ flex ] [ shadow ]">
                <div class="recipe-img">
                    <img src="${receta.urlImg}" alt="">
                </div>
                <div class="[ recipe-info ] [ flow ]">
                    <h2>${receta.titulo}</h2>
                    <div class="[ text-justify ]">${receta.descripcion}</div>
                    <h5>Ingredientes</h5>
                    <ul class="[ recipe-ing ] [ flex ]" data-state="wrap">
            `;
        // Recorrer los ingredientes y anexarlos al html de la receta
        receta.ingredientes.forEach(ingrediente => {
            html += `<li>${ingrediente}</li>`;
        });
        // Cerrar los elementos del html de la receta
        html += `</ul></div></div>`;

        // Boton para regresar a la lista de recetas
        html += `<div class="text-right">
                    <button class="[ btn ]" data-state="primary" onclick="mostrarRecetas()">Volver al listado</button>
                </div>`;

        // Insertar el html en 'view'
        view.innerHTML = html;
    }
}

// Funcion para agregar un ingrediente
function agregarIngrediente() {
    
    // Obten el nombre del ingrediente del input con id 'ingredient-name'
    const nombreIngrediente = document.getElementById('ingredient-name').value;
    // Obten el ul con el id 'ingredient-temp-list'
    const listaIngredientes = document.getElementById('ingredient-temp-list');
    
    // Crear un li con la clase "[ bg-white color-gray ]" para el ingrediente
    let ingrediente = '';
    ingrediente += `<li class="[ bg-white color-gray ]" id="ingrediente-${contadorIngredientes}">`;
        // Agrega el nombre del ingrediente al li
        ingrediente += nombreIngrediente;
        // Agrega un boton para eliminar el ingrediente
        ingrediente += `<button type="button" class="close" onclick="eliminarIngrediente('ingrediente-${contadorIngredientes}')">X</button>`;
    // Cierra el li
    ingrediente += '</li>';

    // Agregar el li al ul
    listaIngredientes.innerHTML += ingrediente;
    // Incrementa el contador de ingredientes
    contadorIngredientes++;
}

// Funcion para eliminar un ingrediente
function eliminarIngrediente(idIngrediente) {
    // Obtener el elemento con el id 'idIngrediente'
    const ingrediente = document.getElementById(idIngrediente);

    // Eliminar el elemento del ul
    ingrediente.remove();
    // Decrementar el contador de ingredientes
    contadorIngredientes--;
}

// Funcion para obtener los ingredientes del ul en un arreglo de cadenas
function obtenerIngredientes() {
    // Obtener el ul con el id 'ingredient-temp-list'
    const listaIngredientes = document.getElementById('ingredient-temp-list');
    // Obtener los li de la lista
    const ingredientes = listaIngredientes.querySelectorAll('li');
    // Crear un arreglo de cadenas
    let ingredientesArr = [];

    // Recorrer los ingredientes
    ingredientes.forEach(ingrediente => {
        // Quitar el ultimo caracter del nombre del ingrediente
        ingrediente.innerText = ingrediente.innerText.slice(0, -1);
        // Agregar el nombre del ingrediente al arreglo
        ingredientesArr.push(ingrediente.innerText);
    });

    // Retornar el arreglo de cadenas
    return ingredientesArr;
}

// Funcion para obtener las recetas de localStorage
function obtenerRecetas() {
    // Obtener el valor de localStorage
    const recetasLS = localStorage.getItem(keyRecetas);
    // Verificar si hay recetas
    if (recetasLS === null) {
        // Retornar un arreglo vacio
        return [];
    } else {
        // Retornar el arreglo de recetas
        return JSON.parse(recetasLS);
    }
}