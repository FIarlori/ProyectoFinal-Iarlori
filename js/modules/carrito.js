function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function calcularTotal(precio, cantidad, impuesto = 0.21) {
    return precio * cantidad * (1 + impuesto);
}

function eliminarProducto(idProducto, categoria) {
    const carrito = obtenerCarrito();
    const itemIndex = carrito.findIndex(item => item.producto.id === idProducto && item.categoria === categoria);
    if (itemIndex === -1) {
        return;
    }
    const item = carrito[itemIndex];
    const cantidadAEliminar = parseInt(document.getElementById(`cantidad-${categoria}-${idProducto}`).textContent);
    if (isNaN(cantidadAEliminar) || cantidadAEliminar <= 0) {
        return;
    }
    switch (true) {
        case cantidadAEliminar >= item.cantidad:
            carrito.splice(itemIndex, 1);
            break;
        default:
            item.cantidad -= cantidadAEliminar;
            break;
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function cambiarCantidad(idProducto, categoria, cambio) {
    const carrito = obtenerCarrito();
    const cantidadSpan = document.getElementById(`cantidad-${categoria}-${idProducto}`);
    const item = carrito.find(item => item.producto.id === idProducto && item.categoria === categoria);
    let cantidad = parseInt(cantidadSpan.textContent);
    cantidad = Math.max(0, Math.min(item.cantidad, cantidad + cambio));
    cantidadSpan.textContent = cantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const carritoDiv = document.getElementById('producto-carrito');
    carritoDiv.innerHTML = '';
    let totalGeneral = 0;
    carrito.forEach(item => {
        const totalProducto = calcularTotal(item.producto.precio, item.cantidad);
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <div class="producto-imagen">
                <img src="../public/images/${item.producto.imagen}" alt="${item.producto.nombre}">
            </div>
            <div class="producto-detalles">
                <p class="producto-nombre">${item.producto.nombre} - $${item.producto.precio}</p>
                <div class="producto-acciones">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${item.producto.id}, '${item.categoria}', -1)">-</button>
                    <span id="cantidad-${item.categoria}-${item.producto.id}">${item.cantidad}</span>
                    <button class="cantidad-btn" onclick="cambiarCantidad(${item.producto.id}, '${item.categoria}', 1)">+</button>
                    <button class="eliminar-btn" onclick="eliminarProducto(${item.producto.id}, '${item.categoria}')">Eliminar</button>
                </div>
            </div>
        `;
        carritoDiv.appendChild(productoDiv);
        totalGeneral += totalProducto;
    });
    document.getElementById('total-carrito').textContent = `Total (incluye IVA 21%): $${totalGeneral.toFixed(2)}`;
}

function inicializarCarrito() {
    document.getElementById('vaciarCarritoBtn').addEventListener('click', vaciarCarrito);
    mostrarCarrito();
}

inicializarCarrito();
