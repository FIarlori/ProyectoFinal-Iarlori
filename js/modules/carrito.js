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
    carrito.splice(itemIndex, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    mostrarNotificacion("Producto eliminado del carrito", "#FFA500");
}

function cambiarCantidad(idProducto, categoria, cambio) {
    const carrito = obtenerCarrito();
    const cantidadSpan = document.getElementById(`cantidad-${categoria}-${idProducto}`);
    const item = carrito.find(item => item.producto.id === idProducto && item.categoria === categoria);
    let cantidad = parseInt(cantidadSpan.textContent);
    cantidad = Math.max(0, cantidad + cambio);

    if (cambio > 0) {
        item.cantidad += cambio;
        mostrarNotificacion("Producto agregado al carrito", "#4CAF50");
    } else if (cambio < 0 && item.cantidad === 1) {
        Swal.fire({
            title: '',
            text: "¿Deseas eliminar este producto del carrito?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, mantener'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarProducto(idProducto, categoria);
            } else {
                cantidadSpan.textContent = 1;
            }
        });
        return;
    } else if (cambio < 0 && item.cantidad > 1) {
        item.cantidad += cambio;
        mostrarNotificacion("Producto eliminado del carrito", "#FFA500");
    }

    cantidadSpan.textContent = item.cantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    Swal.fire({
        title: '',
        text: "¿Deseas vaciar el carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, mantener'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrito");
            mostrarCarrito();
            mostrarNotificacion("Carrito vaciado", "#FFA500");
        }
    });
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
                        <button class="cantidad-btn" onclick="cambiarCantidad(${item.producto.id}, '${item.categoria}', -1)">-</button>
                        <span id="cantidad-${item.categoria}-${item.producto.id}">${item.cantidad}</span>
                        <button class="cantidad-btn" onclick="cambiarCantidad(${item.producto.id}, '${item.categoria}', 1)">+</button>
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
    try {
        const carrito = obtenerCarrito();
        const item = carrito.find(item => item.producto.id === idProducto && item.categoria === categoria);
        if (item) {
            item.cantidad += cantidad;
        } else {
            const producto = { id: idProducto, nombre: "Producto", precio: 100, imagen: "imagen.jpg" }; 
            carrito.push({ producto, categoria, cantidad });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarNotificacion("Producto agregado al carrito", "#4CAF50");
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        mostrarNotificacion("Error al agregar producto al carrito. Inténtalo de nuevo.", "#FF0000");
    }
}

document.querySelectorAll('.agregar-carrito-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const idProducto = event.target.getAttribute('data-id-producto');
        const categoria = event.target.getAttribute('data-categoria');
        agregarProducto(idProducto, categoria);
    });
});

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

function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío.", "#FFA500");
        return;
    }
    cargarPaginaCompra();
}

function cargarPaginaCompra() {
    fetch('compra.html')
        .then(response => response.text())
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        .catch(error => console.error('Error al cargar la página de compra:', error));
}

function inicializarCarrito() {
    document.getElementById('vaciarCarritoBtn').addEventListener('click', vaciarCarrito);
    const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', finalizarCompra);
    }
    mostrarCarrito();
    document.querySelectorAll('.agregar-carrito-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const idProducto = event.target.getAttribute('data-id-producto');
            const categoria = event.target.getAttribute('data-categoria');
            agregarProducto(idProducto, categoria);
        });
    });
}

inicializarCarrito();

const checkoutButton = document.getElementById("checkout-button");
if (checkoutButton) {
    const checkoutSection = document.getElementById("checkout");
    const cartSection = document.getElementById("cart");
    const finalTotal = document.getElementById("final-total");
    const cartTotal = document.getElementById("cart-total");
    const checkoutForm = document.getElementById("checkout-form");

    checkoutButton.addEventListener("click", () => {
        finalTotal.textContent = cartTotal.textContent;

        cartSection.style.display = "none";
        checkoutSection.style.display = "block";
    });

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const direccion = document.getElementById("direccion").value;

        if (nombre && email && direccion) {
            
            checkoutForm.reset();
            checkoutSection.style.display = "none";
            cartSection.style.display = "block";

            document.getElementById("cart-items").innerHTML = "";
            cartTotal.textContent = "0";
        } else {
            mostrarNotificacion("Por favor, completa todos los campos.", "#FF0000");
        }
    });
}
