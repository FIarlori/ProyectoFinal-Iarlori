function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}


function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


function calcularTotal(precio, cantidad, impuesto = 0.21) {
    return precio * cantidad * (1 + impuesto);
}


function mostrarNotificacion(mensaje, color) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: color,
        stopOnFocus: true,
        close: true
    }).showToast();
}


function eliminarProductoDelCarrito(idProducto, categoria) {
    const carrito = obtenerCarrito();
    const itemIndex = carrito.findIndex(item => item.producto.id === idProducto && item.categoria === categoria);
    if (itemIndex === -1) return;

    carrito.splice(itemIndex, 1);
    guardarCarrito(carrito);
    mostrarNotificacion("Producto eliminado del carrito", "#FFA500");
}

function eliminarProductoBoton(event) {
    const idProducto = parseInt(event.target.getAttribute('data-id-producto'));
    const categoria = event.target.getAttribute('data-categoria');

    Swal.fire({
        title: "¿Deseas eliminar este producto del carrito?",
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, mantener'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarProductoDelCarrito(idProducto, categoria);
            mostrarCarrito();
        }
    });
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const carritoDiv = document.getElementById('producto-carrito');
    
    while (carritoDiv.firstChild) {
        carritoDiv.removeChild(carritoDiv.firstChild);
    }

    let totalGeneral = 0;

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement('div');
        mensajeVacio.classList.add('mensaje-vacio');
        mensajeVacio.textContent = 'El carrito está vacío';
        carritoDiv.appendChild(mensajeVacio);
        document.getElementById('finalizarCompraBtn').disabled = true;
        document.getElementById('vaciarCarritoBtn').disabled = true;
    } else {
        carrito.forEach(item => {
            const totalProducto = calcularTotal(item.producto.precio, item.cantidad);
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');

            const productoImagen = document.createElement('div');
            productoImagen.classList.add('producto-imagen');
            const imagen = document.createElement('img');
            imagen.src = `../assets/images/${item.producto.imagen}`;
            imagen.alt = item.producto.nombre;
            productoImagen.appendChild(imagen);

            const productoDetalles = document.createElement('div');
            productoDetalles.classList.add('producto-detalles');

            const productoNombre = document.createElement('p');
            productoNombre.classList.add('producto-nombre');
            productoNombre.textContent = `${item.producto.nombre} - $${item.producto.precio}`;

            const productoAcciones = document.createElement('div');
            productoAcciones.classList.add('producto-acciones');

            const botonDisminuir = document.createElement('button');
            botonDisminuir.classList.add('cantidad-btn');
            botonDisminuir.setAttribute('data-id-producto', item.producto.id);
            botonDisminuir.setAttribute('data-categoria', item.categoria);
            botonDisminuir.setAttribute('data-cambio', '-1');
            botonDisminuir.textContent = '-';

            const cantidadSpan = document.createElement('span');
            cantidadSpan.id = `cantidad-${item.categoria}-${item.producto.id}`;
            cantidadSpan.textContent = item.cantidad;

            const botonAumentar = document.createElement('button');
            botonAumentar.classList.add('cantidad-btn');
            botonAumentar.setAttribute('data-id-producto', item.producto.id);
            botonAumentar.setAttribute('data-categoria', item.categoria);
            botonAumentar.setAttribute('data-cambio', '1');
            botonAumentar.textContent = '+';

            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('eliminar-btn');
            botonEliminar.style.width = '100px';
            botonEliminar.setAttribute('data-id-producto', item.producto.id);
            botonEliminar.setAttribute('data-categoria', item.categoria);
            botonEliminar.textContent = 'Eliminar';

            productoAcciones.appendChild(botonDisminuir);
            productoAcciones.appendChild(cantidadSpan);
            productoAcciones.appendChild(botonAumentar);
            productoAcciones.appendChild(botonEliminar);

            productoDetalles.appendChild(productoNombre);
            productoDetalles.appendChild(productoAcciones);

            productoDiv.appendChild(productoImagen);
            productoDiv.appendChild(productoDetalles);

            carritoDiv.appendChild(productoDiv);

            totalGeneral += totalProducto;
        });

        document.getElementById('finalizarCompraBtn').disabled = false;
        document.getElementById('vaciarCarritoBtn').disabled = false;
    }

    document.getElementById('total-carrito').textContent = `Total (incluye IVA 21%): $${totalGeneral.toFixed(2)}`;
}

function actualizarCantidadEnCarrito(idProducto, categoria, cambio) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.producto.id === idProducto && item.categoria === categoria);
    if (!item) return;

    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        Swal.fire({
            title: "¿Deseas eliminar este producto del carrito?",
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, mantener'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarProductoDelCarrito(idProducto, categoria);
                mostrarCarrito();
            } else {
                item.cantidad = 1;
                guardarCarrito(carrito);
                mostrarCarrito();
            }
        });
    } else {
        item.cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        mostrarNotificacion(
            cambio > 0 ? "Producto agregado al carrito" : "Producto eliminado del carrito",
            cambio > 0 ? "#4CAF50" : "#FFA500"
        );
        mostrarCarrito();
    }
}


function vaciarCarrito() {
    Swal.fire({
        title: "¿Deseas vaciar el carrito?",
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, mantener'
    }).then((result) => {
        if (result.isConfirmed) {
            guardarCarrito([]);
            mostrarCarrito();
            mostrarNotificacion("Carrito vaciado", "#FFA500");
        }
    });
}


function manejarCambioCantidad(event) {
    const idProducto = parseInt(event.target.getAttribute('data-id-producto'));
    const categoria = event.target.getAttribute('data-categoria');
    const cambio = parseInt(event.target.getAttribute('data-cambio'));

    actualizarCantidadEnCarrito(idProducto, categoria, cambio);
}


function agregarProducto(idProducto, categoria, cantidad = 1) {
    try {
        const carrito = obtenerCarrito();
        const item = carrito.find(item => item.producto.id === idProducto && item.categoria === categoria);
        if (item) {
            item.cantidad += cantidad;
        } else {
            const producto = { id: idProducto, nombre: "Producto", precio: 100, imagen: "imagen.jpg" }; 
            carrito.push({ producto, categoria, cantidad });
        }
        guardarCarrito(carrito);
        mostrarNotificacion("Producto agregado al carrito", "#4CAF50");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al agregar producto al carrito',
            text: error.message
        });
    }
}


function cargarPaginaCompra() {
    fetch('compra.html')
        .then(response => response.text())
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar la página de compra',
                text: error.message
            });
        });
}


function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío.", "#FFA500");
        return;
    }
    cargarPaginaCompra();
}


function inicializarCarrito() {
    document.getElementById('vaciarCarritoBtn').addEventListener('click', vaciarCarrito);
    const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', finalizarCompra);
    }

    document.querySelectorAll('.agregar-carrito-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const idProducto = event.target.getAttribute('data-id-producto');
            const categoria = event.target.getAttribute('data-categoria');
            agregarProducto(parseInt(idProducto), categoria);
        });
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('cantidad-btn')) {
            manejarCambioCantidad(event);
        } else if (event.target.classList.contains('eliminar-btn')) {
            eliminarProductoBoton(event);
        }
    });

    mostrarCarrito();
}

inicializarCarrito();