const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalGeneral = 0;
carrito.forEach(item => {
    totalGeneral += item.producto.precio * item.cantidad * 1.21; 
});
document.getElementById('final-total').textContent = totalGeneral.toFixed(2);

const metodoDePago = document.getElementById('metodo-pago');
const datosTarjetaDiv = document.getElementById('datos-tarjeta');

metodoDePago.addEventListener('change', () => {
    if (metodoDePago.value === 'tarjeta') {
        datosTarjetaDiv.style.display = 'block';
    } else {
        datosTarjetaDiv.style.display = 'none';
    }
});

function mostrarMensajeError(input, mensaje) {
    let errorSpan = input.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('error-message')) {
        errorSpan = document.createElement('span');
        errorSpan.classList.add('error-message');
        input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    errorSpan.textContent = mensaje;
}

function limpiarMensajeError(input) {
    let errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.textContent = '';
    }
}

document.getElementById('nombre').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^[a-zA-Z\s]+$/.test(input.value)) {
        mostrarMensajeError(input, 'El nombre solo debe contener letras.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('email').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('email').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        mostrarMensajeError(input, 'El correo electrónico debe tener un formato válido.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('numero-tarjeta').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('numero-tarjeta').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^\d{14,19}$/.test(input.value)) {
        mostrarMensajeError(input, 'El número de tarjeta debe tener entre 14 y 19 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('nombre-tarjeta').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^[a-zA-Z\s]+$/.test(input.value)) {
        mostrarMensajeError(input, 'El nombre solo debe contener letras.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('fecha-expiracion').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('fecha-expiracion').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) {
        mostrarMensajeError(input, 'La fecha de vencimiento debe tener el formato mm/yy.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('cvc-tarjeta').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('cvc-tarjeta').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^\d{3,4}$/.test(input.value)) {
        mostrarMensajeError(input, 'El código de seguridad debe tener entre 3 y 4 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('dni-tarjeta').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('dni-tarjeta').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^\d{7,10}$/.test(input.value)) {
        mostrarMensajeError(input, 'El DNI debe tener entre 7 y 10 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    Swal.fire({
        title: '¡Estás a un paso de completar tu compra! ',
        text: "¿Deseas continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            procesarCompra();
        }
    });
});

function procesarCompra() {
    try {
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const direccion = document.getElementById("direccion").value;
        const paymentMethod = metodoDePago.value;
        const datosTarjeta = Array.from(datosTarjetaDiv.querySelectorAll('input')).map(input => ({
            nombre: input.previousElementSibling.textContent.replace(':', ''),
            value: input.value
        }));

        let camposIncompletos = [];
        if (!/^[a-zA-Z\s]+$/.test(nombre)) camposIncompletos.push('Nombre');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) camposIncompletos.push('Correo Electrónico');
        if (!direccion) camposIncompletos.push('Dirección');
        if (paymentMethod === 'tarjeta') {
            datosTarjeta.forEach(dato => {
                if (dato.nombre === 'Número de tarjeta' && !/^\d{14,19}$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Nombre y apellido del titular' && !/^[a-zA-Z\s]+$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Fecha de vencimiento' && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Código de seguridad' && !/^\d{3,4}$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'DNI del titular de la tarjeta' && !/^\d{7,10}$/.test(dato.value)) camposIncompletos.push(dato.nombre);
            });
        }

        if (camposIncompletos.length === 0) {
            Swal.fire({
                icon: 'success',
                title: '¡Gracias por tu compra!',
                text: `Un resumen ha sido enviado a ${email}.`,
                showConfirmButton: true,
                allowOutsideClick: true
            }).then(() => {
                guardarHistorialCompra(nombre, email, direccion, paymentMethod, datosTarjeta, totalGeneral, carrito);
                localStorage.removeItem("carrito");
                document.getElementById('checkout-form').reset();
                const productoCarrito = document.getElementById('producto-carrito');
                if (productoCarrito) {
                    productoCarrito.innerHTML = '<div class="mensaje-vacio">El carrito está vacío</div>';
                }
                const totalCarrito = document.getElementById('total-carrito');
                if (totalCarrito) {
                    totalCarrito.textContent = 'Total (incluye IVA 21%): $0.00';
                }
                mostrarComprobante(nombre, email, direccion, paymentMethod, datosTarjeta, totalGeneral, carrito);
            });
        } else {
            throw new Error(`Por favor, completa los siguientes campos: ${camposIncompletos.join(', ')}`);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al procesar la compra',
            text: error.message
        });
    }
}

function mostrarComprobante(nombre, email, direccion, paymentMethod, datosTarjeta, total, carrito) {
    let detallesTarjeta = '';
    if (paymentMethod === 'tarjeta') {
        detallesTarjeta = `
            <p><strong>Número de tarjeta:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Número de tarjeta').value}</p>
            <p><strong>Nombre del titular:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Nombre y apellido del titular').value}</p>
            <p><strong>Fecha de vencimiento:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Fecha de vencimiento').value}</p>
            <p><strong>Código de seguridad:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Código de seguridad').value}</p>
            <p><strong>DNI del titular:</strong> ${datosTarjeta.find(dato => dato.nombre === 'DNI del titular de la tarjeta').value}</p>
        `;
    }

    const productosComprados = carrito.map(item => `
        <p>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}</p>
    `).join('');

    const comprobanteHTML = `
        <div id="comprobante-compra" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 100%;">
                <h2>Comprobante de Compra</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Correo Electrónico:</strong> ${email}</p>
                <p><strong>Dirección:</strong> ${direccion}</p>
                <p><strong>Método de Pago:</strong> ${paymentMethod === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'}</p>
                ${detallesTarjeta}
                <p><strong>Productos:</strong>
                ${productosComprados}
                <p><strong>Total Pagado:</strong> $${total.toFixed(2)}</p>
                <button onclick="cerrarComprobante()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
            </div>
        </div>
    `;

    const comprobanteDiv = document.createElement('div');
    comprobanteDiv.innerHTML = comprobanteHTML;
    document.body.appendChild(comprobanteDiv);
}

function cerrarComprobante() {
    const comprobanteDiv = document.getElementById('comprobante-compra');
    if (comprobanteDiv) {
        comprobanteDiv.remove();
    }
}

function redirigirAInicio() {
    const rutaInicio = '../index.html'; 
    const enlace = document.createElement('a');
    enlace.href = rutaInicio;
    enlace.style.display = 'none'; 
    document.body.appendChild(enlace);
    enlace.click(); 
    document.body.removeChild(enlace); 
}

function guardarHistorialCompra(nombre, email, direccion, paymentMethod, datosTarjeta, total, carrito) {
    const historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
    const nuevaCompra = {
        nombre,
        email,
        direccion,
        paymentMethod,
        datosTarjeta,
        total,
        carrito,
        fecha: new Date().toLocaleString()
    };
    historialCompras.push(nuevaCompra);
    localStorage.setItem('historialCompras', JSON.stringify(historialCompras));
}