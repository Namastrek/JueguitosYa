const stockProductos = [
    {
        id: 1,
        nombre: "The Las Of Us",
        cantidad: 1,
        desc: "Mundo abierto, Supervivencia.",
        precio: 4000,
        img: "img/thelastofus.jpg"
    },
    {
        id: 2,
        nombre: "Persona 5",
        cantidad: 1,
        desc: "Juego de acción por turnos, anime.",
        precio: 2000,
        img: "img/persona5.jpg"
    },
    {
        id: 3,
        nombre: "Pacman",
        cantidad: 1,
        desc: "Plataformas, arcade, clásicos.",
        precio: 250,
        img: "img/pacman.jpg"
    },
    {
        id: 4,
        nombre: "crash Bandicoot",
        cantidad: 1,
        desc: "Plataformas, arcade, clásicos.",
        precio: 250,
        img: "img/crash.jpg"
    },
    {
        id: 5,
        nombre: "Control",
        cantidad: 1,
        desc: "Misterio, poderes, policiales.",
        precio: 1000,
        img: "./img/control.jpg"
    },
    {
        id: 6,
        nombre: "Call Of Duty",
        cantidad: 1,
        desc: "Disparos, multijugador.",
        precio: 600,
        img: "./img/callduty.jpg"
    },
    {
      id: 7,
      nombre: "Assassins Creeds Origins",
      cantidad: 1,
      desc: "Mundo abierto, acción, rpg.",
      precio: 2000,
      img: "img/asesino.jpeg"
  },
  {
    id: 8,
    nombre: "Outlast 2",
    cantidad: 1,
    desc: "Terror, supervivencia, acción.",
    precio: 1750,
    img: "img/outlast.jpg"
}
]

let carrito = []

const contenedor = document.querySelector("#contenedor")
const carritoContenedor = document.querySelector("#carritoContenedor")
const vaciarCarrito = document.querySelector("#vaciarCarrito")
const precioTotal = document.querySelector("#precioTotal")
const activarFuncion = document.querySelector("#activarFuncion")
const procesarCompra = document.querySelector("#procesarCompra")
const totalProceso = document.querySelector("#totalProceso")
const formulario = document.querySelector('#procesar-pago')

activarFuncion && (activarFuncion.addEventListener("click", procesarPedido));

document.addEventListener("DOMContentLoaded", () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  mostrarCarrito();
  document.querySelector("#activarFuncion").click(procesarPedido);
});
if(formulario){
  formulario.addEventListener('submit', enviarCompra)
}


if (vaciarCarrito) {
  vaciarCarrito.addEventListener("click", () => {
    carrito.length = [];
    mostrarCarrito();
  });
}

if (procesarCompra) {
  procesarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "¡Tu carrito está vacio!",
        text: "Compra algo para continuar con la compra",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      location.href = "carrito.html";
    }
  })
}

stockProductos.forEach((prod) => {
  const { id, nombre, precio, desc, img, cantidad } = prod;
  if (contenedor) {
    contenedor.innerHTML += `
    <div class="card mt-3" style="width: 18rem;">
    <img class="card-img-top mt-2" src="${img}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text">Precio: $${precio}</p>
      <p class="card-text">Descripcion: ${desc}</p>
      <p class="card-text">Cantidad: ${cantidad}</p>
      <button class="btn btn-primary" onclick="agregarProducto(${id})">Comprar Producto</button>
    </div>
  </div>
    `
  }
})

const agregarProducto = (id) => {
  const existe = carrito.some(prod => prod.id === id)

  if(existe){
    const prod = carrito.map(prod => {
      prod.id === id && prod.cantidad++
    })
  } else {
    const item = stockProductos.find((prod) => prod.id === id)
    carrito.push(item)
  }
  mostrarCarrito()
};

const mostrarCarrito = () => {
  const modalBody = document.querySelector(".modal .modal-body")
  if (modalBody) {
    modalBody.innerHTML = ""
    carrito.forEach((prod) => {
      const { id, nombre, precio, img, cantidad } = prod
      console.log(modalBody)
      modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
          <img class="img-fluid img-carrito" src="${img}"/>
        </div>
        <div>
          <p>Producto: ${nombre}</p>
          <p>Precio: ${precio}</p>
          <p>Cantidad : ${cantidad}</p>
          <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
        </div>
      </div>
      `
    })
  }

  carrito.length === 0 && (modalBody.innerHTML = `
  <p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
  `)

  carritoContenedor.textContent = carrito.length;

  precioTotal && (precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio,0))

  guardarStorage()
}

function guardarStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

function eliminarProducto(id) {
  const juegoId = id;
  carrito = carrito.filter((juego) => juego.id !== juegoId)
  mostrarCarrito();
}
function procesarPedido() {
  carrito.forEach((prod) => {
    const listaCompra = document.querySelector("#lista-compra tbody")
    const {nombre, precio, img, cantidad } = prod;
    if (listaCompra) {
      const row = document.createElement("tr")
      row.innerHTML += `
              <td>
              <img class="img-fluid img-carrito" src="${img}"/>
              </td>
              <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>${precio * cantidad}</td>
            `
      listaCompra.appendChild(row)
    }
  })
  totalProceso.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio,0)
}

function enviarCompra(e){
   e.preventDefault()
   const persona = document.querySelector('#persona').value
   const email = document.querySelector('#correo').value

   if(email === '' || persona == ''){
     Swal.fire({
       title: "¡Debes completar tu email y nombre!",
       text: "Rellena el formulario",
       icon: "error",
       confirmButtonText: "Aceptar",
   })
 } else {
   const spinner = document.querySelector('#spinner')
   spinner.classList.add('d-flex')
   spinner.classList.remove('d-none')

   setTimeout(() => {
     spinner.classList.remove('d-flex')
     spinner.classList.add('d-none')
     formulario.reset()

     const alertExito = document.createElement('p')
     alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
     alertExito.textContent = 'Compra realizada correctamente'
     formulario.appendChild(alertExito)

     setTimeout(() => {
       alertExito.remove()
     }, 3000)
   }, 3000)
 }
 localStorage.clear()
}