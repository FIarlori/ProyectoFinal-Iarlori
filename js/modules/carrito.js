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


function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const carritoDiv = document.getElementById('producto-carrito');
    carritoDiv.innerHTML = '';
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
            productoDiv.innerHTML = `
                <div class="producto-imagen">
                    <img src="../assets/images/${item.producto.imagen}" alt="${item.producto.nombre}">
                </div>
                <div class="producto-detalles">
                    <p class="producto-nombre">${item.producto.nombre} - $${item.producto.precio}</p>
                    <div class="producto-acciones">
                        <button class="cantidad-btn" data-id-producto="${item.producto.id}" data-categoria="${item.categoria}" data-cambio="-1">-</button>
                        <span id="cantidad-${item.categoria}-${item.producto.id}">${item.cantidad}</span>
                        <button class="cantidad-btn" data-id-producto="${item.producto.id}" data-categoria="${item.categoria}" data-cambio="1">+</button>
                    </div>
                </div>
            `;
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
        }
    });

    mostrarCarrito();
}

inicializarCarrito();