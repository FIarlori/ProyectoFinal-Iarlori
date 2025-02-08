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
    if (!/^[a-zA-Z\s]+$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El nombre solo debe contener letras.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('email').setAttribute('type', 'text'); 

document.getElementById('email').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('email').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El correo electrónico debe tener un formato válido.');
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
    if (!/^\d{14,19}$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El número de tarjeta debe tener entre 14 y 19 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('nombre-tarjeta').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^[a-zA-Z\s]+$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El nombre solo debe contener letras.');
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
    const [month, year] = input.value.trim().split('/');
    const expirationDate = new Date(`20${year}`, month - 1);
    const currentDate = new Date();

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. La fecha de vencimiento debe tener el formato mm/yy.');
    } else if (expirationDate < currentDate) {
        mostrarMensajeError(input, 'La tarjeta ha expirado. Utilice otra tarjeta.');
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
    if (!/^\d{3,4}$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El código de seguridad debe tener entre 3 y 4 dígitos.');
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
    if (!/^\d{7,10}$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El DNI debe tener entre 7 y 10 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('direccion').addEventListener('blur', (event) => {
    const input = event.target;
    if (input.value.trim() === "") {
        mostrarMensajeError(input, 'Campo requerido.');
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
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const paymentMethod = metodoDePago.value;
        const datosTarjeta = Array.from(datosTarjetaDiv.querySelectorAll('input')).map(input => ({
            nombre: input.previousElementSibling.textContent.replace(':', ''),
            value: input.value.trim()
        }));

        let camposIncompletos = [];
        if (!/^[a-zA-Z\s]+$/.test(nombre)) camposIncompletos.push('Nombre');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) camposIncompletos.push('Correo Electrónico');
        if (direccion === "") camposIncompletos.push('Dirección');
        if (paymentMethod === 'tarjeta') {
            datosTarjeta.forEach(dato => {
                if (dato.nombre === 'Número de tarjeta' && !/^\d{14,19}$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Nombre y apellido del titular' && !/^[a-zA-Z\s]+$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Fecha de vencimiento') {
                    const [month, year] = dato.value.split('/');
                    const expirationDate = new Date(`20${year}`, month - 1);
                    const currentDate = new Date();
                    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(dato.value) || expirationDate < currentDate) {
                        camposIncompletos.push(dato.nombre);
                    }
                }
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
                redirigirAInicio();
            });
        } else {
            throw new Error(`Por favor, completa los siguientes campos: ${camposIncompletos.join(', ')}`);
        }
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        Swal.fire({
            icon: 'error',
            title: error.message,
        });
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