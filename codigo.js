const url = 'https://insidious-important-captain.glitch.me';
var elementos = [];
var claseTachada = "text-decoration-line-through";
var claseBoton = "check";
var claseSpan = "span-check";
var claseTransparecia = "transparencia";

function verificarInput() {
    var valor = document.getElementById("data").value;
    if (!valor) {
        alert("Por favor, ingresa un valor en el campo.");
    } else {
        ingresarValor();
    };
};

function cargarDatos() {
    fetch(`${url}/todos`)
        .then(response => response.json())
        .then(data => {
            elementos = data;
            
            var contenedor = document.getElementById("contenedor");
            var contenedorCompletados = document.getElementById("contenedorTerminado");
            for (let i = 0; i < elementos.length; i++) {
                contenedor.innerHTML+=htmlNuevoElemento(elementos[i]);

                var li = document.getElementById(`entrada-${elementos[i].id}`);
                var boton = document.getElementById(`boton-${elementos[i].id}`);
                var span = document.getElementById(`span-${elementos[i].id}`);
                if (elementos[i].estado == false) {
                    li.classList.remove(claseTachada,claseTransparecia);
                    boton.classList.remove(claseBoton);
                    span.classList.remove(claseSpan);
                    contenedor.appendChild(li);
                } else {
                    li.classList.add(claseTachada,claseTransparecia);
                    boton.classList.add(claseBoton);
                    span.classList.add(claseSpan);
                    contenedorCompletados.appendChild(li);
                }
            }
 as asd as
            mostrarBottonEliminarTodo();
    });

}
cargarDatos();

function ingresarConEnter() {
    document.getElementById('data').addEventListener('keyup', function(event) {
        if(event.key === 'Enter'){
            verificarInput();
        };
    });
};

function generarIDUnico() {
    return Date.now();
}
function ingresarValor() {
    var contenedor = document.getElementById("contenedor");
    var valor = document.getElementById("data").value;
    var nuevoElemento = {
        valor : valor,
        fecha: new Date(),
        estado : false
    }
    fetch(`${url}/todos`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(nuevoElemento)
    })
    .then(response => response.json())
    .then(data => {
        nuevoElemento.id = data.id;

        elementos.push(nuevoElemento);
        //Ingresa los objetos al Local Storage
        localStorage.setItem(`lista`, JSON.stringify(elementos));
        contenedor.innerHTML+=htmlNuevoElemento(nuevoElemento);
            
        mostrarBottonEliminarTodo();

        document.getElementById("data").value = "";
        document.getElementById("data").focus();
    });
   
};

function mostrarBottonEliminarTodo () {
    var botton = document.getElementById("botonBorrarTodo");
    if (elementos.length > 0  ){
        botton.style.display = "block";
    }else {
        botton.style.display = "none";
    }
}

function htmlNuevoElemento(nuevoElemento){
    return `<li class="list-group-item shadow p-3 mb-3 bg-body-tertiary rounded" id="entrada-${nuevoElemento.id}">
        <div class="container">
            <div class="d-flex">
                <div class="p-2 flex-grow-1">
                    <p>${nuevoElemento.valor}</p>
                </div>
                <div class="p-2">
                    <button type="button" class="btn btn-outline-success btn-sm" id="boton-${nuevoElemento.id}" onclick="cambiarCompletados(${nuevoElemento.id})"><span class="material-symbols-outlined" id="span-${nuevoElemento.id}">check</span></button>
                </div>
                <div class="p-2">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="borrarEntrada(${nuevoElemento.id})"><span class="material-symbols-outlined">delete</span></button>
                </div>
            </div>
        </div>
    </li>`
}

document.addEventListener('DOMContentLoaded', ingresarConEnter);         

function borrarEntrada(id) {
    var entrada = document.getElementById(`entrada-${id}`);
    elementos =  elementos.filter((element)=> element.id != id);
    fetch(`${url}/todos/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        entrada.remove();
        mostrarBottonEliminarTodo();
    });
};

function cambiarCompletados(id) {
    var elementoActual = elementos.find((element)=> element.id === id);

    var li = document.getElementById(`entrada-${id}`);
    var boton = document.getElementById(`boton-${id}`);
    var elemento = document.getElementById(`entrada-${id}`);
    var span = document.getElementById(`span-${id}`);
    var contenedorIncompleto = document.getElementById("contenedor");
    var contenedorCompletados = document.getElementById("contenedorTerminado");
    var estadoActual = elementoActual.estado;
    
    elementoActual.estado = !estadoActual;

    fetch(`${url}/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(elementoActual),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (estadoActual == true) {
            li.classList.remove(claseTachada,claseTransparecia);
            boton.classList.remove(claseBoton);
            span.classList.remove(claseSpan);
            contenedorIncompleto.appendChild(elemento);
        } else {
            li.classList.add(claseTachada,claseTransparecia);
            boton.classList.add(claseBoton);
            span.classList.add(claseSpan);
            contenedorCompletados.appendChild(elemento);
        }
    })
};

function borrarTodo() {
    const confirmacion = confirm("Esta seguro que deseas borrar todos los elementos?");
    var contenedor = document.getElementById("contenedor");
    var contenedorCompletados = document.getElementById("contenedorTerminado");
    var contenedorBoton = document.getElementById("contenedorBoton");
    if (confirmacion) {
        contenedorBoton.innerHTML= "";
        contenedor.innerHTML= "";
        contenedorCompletados.innerHTML= "";
        for (let i = 0; i < elementos.length; i++) {
            fetch(`${url}/todos/${elementos[i].id}`,{method:"DELETE"})
            .then(res => res.json())
            .then(data => {
                
            });
        };
    };
    
    elementos = [];
};