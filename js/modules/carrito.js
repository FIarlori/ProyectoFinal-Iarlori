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
            mostrarNotificacion("Producto eliminado del carrito");
            break;
        default:
            item.cantidad -= cantidadAEliminar;
            mostrarNotificacion("Producto eliminado del carrito");
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
    mostrarNotificacion("Carrito vaciado");
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
        document.getElementById('finalizarCompraBtn').disabled = false;
        document.getElementById('vaciarCarritoBtn').disabled = false;
    }

    document.getElementById('total-carrito').textContent = `Total (incluye IVA 21%): $${totalGeneral.toFixed(2)}`;
}

function agregarProducto(idProducto, categoria, cantidad = 1) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.producto.id === idProducto && item.categoria === categoria);
    if (item) {
        item.cantidad += cantidad;
    } else {
        const producto = { id: idProducto, nombre: "Producto", precio: 100, imagen: "imagen.jpg" }; // Replace with actual product details
        carrito.push({ producto, categoria, cantidad });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarNotificacion("Producto agregado al carrito");
}

// Ensure this function is called when the "Agregar al carrito" button is clicked
document.querySelectorAll('.agregar-carrito-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const idProducto = event.target.getAttribute('data-id-producto');
        const categoria = event.target.getAttribute('data-categoria');
        agregarProducto(idProducto, categoria);
    });
});

function mostrarNotificacion(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50",
        stopOnFocus: true
    }).showToast();
}

function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío.");
        return;
    }
    window.location.href = "compra.html";
}

function inicializarCarrito() {
    document.getElementById('vaciarCarritoBtn').addEventListener('click', vaciarCarrito);
    const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', finalizarCompra);
    }
    mostrarCarrito();
    // Initialize the add product functionality
    document.querySelectorAll('.agregar-carrito-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const idProducto = event.target.getAttribute('data-id-producto');
            const categoria = event.target.getAttribute('data-categoria');
            agregarProducto(idProducto, categoria);
        });
    });
}

inicializarCarrito();

// Selección de elementos
const checkoutButton = document.getElementById("checkout-button");
if (checkoutButton) {
    const checkoutSection = document.getElementById("checkout");
    const cartSection = document.getElementById("cart");
    const finalTotal = document.getElementById("final-total");
    const cartTotal = document.getElementById("cart-total");
    const checkoutForm = document.getElementById("checkout-form");

    // Mostrar la sección de finalizar compra
    checkoutButton.addEventListener("click", () => {
        // Transferir el total del carrito a la sección de checkout
        finalTotal.textContent = cartTotal.textContent;

        // Mostrar la sección de finalizar compra y ocultar el carrito
        cartSection.style.display = "none";
        checkoutSection.style.display = "block";
    });

    // Manejo del envío del formulario de compra
    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;

        // Validación y simulación del proceso de compra
        if (name && email && address) {
            mostrarNotificacion(`¡Gracias por tu compra, ${name}! Un resumen ha sido enviado a ${email}.`);
            
            // Resetear formulario y mostrar el carrito nuevamente
            checkoutForm.reset();
            checkoutSection.style.display = "none";
            cartSection.style.display = "block";

            // Limpiar el carrito (opcional)
            document.getElementById("cart-items").innerHTML = "";
            cartTotal.textContent = "0";
        } else {
            mostrarNotificacion("Por favor, completa todos los campos.");
        }
    });
}
