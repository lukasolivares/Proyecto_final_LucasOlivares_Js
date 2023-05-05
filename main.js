//Productos
let productos = []

fetch("productos.json")
    .then(response => response.json())
    .then(data => {
    productos = data
    renderizarShop(productos)
    })
    .catch(error => console.error(error))



//DOM

let botonesAgregar = document.querySelectorAll(".botones-agregar")
const numerito = document.querySelector("#numerito")


//variable filtros
let contenedorProductos = document.getElementById("contenedorProductos")
renderizarShop(productos)

let buscador = document.getElementById("buscador")
buscador.addEventListener("input", filtrarPorNombre)

let inputs = document.getElementsByClassName("input")
console.log(inputs)
for (const input of inputs) {
    input.addEventListener("click", flitrarPorCategoria)
}

function flitrarPorCategoria(e) {
    console.log(e.target.id)
    console.dir(e.target.checked)
    let filtros = []
    for (const input of inputs) {
        console.log(input.checked)
        console.log(input.id)
        if (input.checked) {
            filtros.push(input.id)
        }
    }
    console.log(filtros)
    let arrayFiltrado = productos.filter(producto => filtros.includes(producto.categoria))
    renderizarShop(arrayFiltrado.length > 0 ? arrayFiltrado : productos)

}

function filtrarPorNombre(e) {
    console.log(e.target.id)
    let arrayFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()))
    renderizarShop(arrayFiltrado)
}


//Funcion de Productos

function renderizarShop(arrayDeProductos) {
    contenedorProductos.innerHTML = ""
    arrayDeProductos.forEach(producto => {

        let tarjeta = document.createElement("div")
        tarjeta.className = "cards"
        tarjeta.innerHTML = `
            <img class="img_card" src = ${producto.img} alt=${producto.nombre}>
            <div class="card-detalles">
                <h2 class="card-titulo">${producto.nombre}</h2>
                <p>Precio: $${producto.precio}</p>
                <button class="producto-agregar" id=${producto.id}>Agregar</button>
            </div>
        `
        contenedorProductos.appendChild(tarjeta)
    })
    actualizarBotonesAgregar()
}

//Agregar Al carrito//

function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar")

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    });
}

let productosEnCarrito

let productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito")) || []


if (productosEnCarritoLS) {
    productosEnCarrito = productosEnCarritoLS
} else {
    productosEnCarrito = []
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "#21a782",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id
    const productoAgregado = productos.find(producto => producto.id === idBoton)

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton)
        productosEnCarrito[index].cantidad++
    } else {
        productoAgregado.cantidad = 1
        productosEnCarrito.push(productoAgregado)
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)
    numerito.innerText = nuevoNumerito

}



