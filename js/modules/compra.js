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

document.getElementById('email').addEventListener('input', (event) => {
    const input = event.target;
    input.value = input.value.replace(/\s+/g, '');
});

document.getElementById('email').addEventListener('blur', (event) => {
    const input = event.target;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. Por favor ingresa un correo electrónico válido.');
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
    const [month, year] = input.value.split('/');
    const currentDate = new Date();
    const inputDate = new Date(`20${year}`, month - 1);

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. La fecha de vencimiento debe tener el formato mm/yy.');
    } else if (inputDate < currentDate) {
        mostrarMensajeError(input, 'La fecha de vencimiento ingresada ha expirado. Por favor, ingrese una fecha válida.');
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
    if (!/^\d{7,10}$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. El DNI debe tener entre 7 y 10 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
});

document.getElementById('direccion').addEventListener('blur', (event) => {
    const input = event.target;
    if (!input.value.trim()) {
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
        const metodoPago = metodoDePago.value;
        const datosTarjeta = Array.from(datosTarjetaDiv.querySelectorAll('input')).map(input => ({
            nombre: input.previousElementSibling.textContent.replace(':', ''),
            value: input.value.trim()
        }));

        let camposIncompletos = [];
        if (!/^[a-zA-Z\s]+$/.test(nombre)) camposIncompletos.push('Nombre');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) camposIncompletos.push('Correo Electrónico');
        if (!direccion.trim()) camposIncompletos.push('Dirección');
        if (metodoPago === 'tarjeta') {
            datosTarjeta.forEach(dato => {
                if (dato.nombre === 'Número de tarjeta' && !/^\d{14,19}$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Nombre y apellido del titular' && !/^[a-zA-Z\s]+$/.test(dato.value)) camposIncompletos.push(dato.nombre);
                if (dato.nombre === 'Fecha de vencimiento') {
                    const [month, year] = dato.value.split('/');
                    const currentDate = new Date();
                    const inputDate = new Date(`20${year}`, month - 1);
                    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(dato.value) || inputDate < currentDate) {
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
                showConfirmButton: true,
                allowOutsideClick: true
            }).then(() => {
                guardarHistorialCompra(nombre, email, direccion, metodoPago, datosTarjeta, totalGeneral, carrito);
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
                mostrarComprobante(nombre, email, direccion, metodoPago, datosTarjeta, totalGeneral, carrito);
            });
        } else {
            const camposIncompletosHTML = camposIncompletos.map(campo => `<li style="text-align: left;">${campo}</li>`).join('');
            throw new Error(`Por favor, completa los siguientes campos:<ul style="text-align: left;">${camposIncompletosHTML}</ul>`);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al procesar la compra',
            html: error.message
        });
    }
}

function mostrarComprobante(nombre, email, direccion, metodoPago, datosTarjeta, total, carrito) {
    const fechaCompra = new Date().toLocaleString();
    let detallesTarjeta = '';
    if (metodoPago === 'tarjeta') {
        detallesTarjeta = `
            <p><strong>Número de tarjeta:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Número de tarjeta').value}</p>
            <p><strong>Nombre del titular:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Nombre y apellido del titular').value}</p>
            <p><strong>Fecha de vencimiento:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Fecha de vencimiento').value}</p>
            <p><strong>Código de seguridad:</strong> ${datosTarjeta.find(dato => dato.nombre === 'Código de seguridad').value}</p>
            <p><strong>DNI del titular:</strong> ${datosTarjeta.find(dato => dato.nombre === 'DNI del titular de la tarjeta').value}</p>
        `;
    }

    const productosComprados = carrito.map(item => `
        <li>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}</li>
    `).join('');

    const comprobanteHTML = `
        <div id="comprobante-compra" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 100%;">
                <h2>Comprobante de Compra</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Correo Electrónico:</strong> ${email}</p>
                <p><strong>Dirección:</strong> ${direccion}</p>
                <p><strong>Fecha:</strong> ${fechaCompra}</p>
                <p><strong>Método de Pago:</strong> ${metodoPago === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'}</p>
                <p><strong>Productos:</strong></p>
                <ul style="text-align: left;">${productosComprados}</ul>
                <p><strong>Total:</strong> $${total.toFixed(2)}</p>
                <div style="height: 30px;"></div>
                <button onclick="cerrarComprobanteYRedirigir()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
                <button onclick="descargarComprobante('${nombre}', '${email}', '${direccion}', '${metodoPago}', '${total}', \`${productosComprados}\`, '${fechaCompra}')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Descargar</button>
            </div>
        </div>
    `;

    const comprobanteDiv = document.createElement('div');
    comprobanteDiv.innerHTML = comprobanteHTML;
    document.body.appendChild(comprobanteDiv);
}

function cerrarComprobanteYRedirigir() {
    cerrarComprobante();
    redirigirAInicio();
}

function cerrarComprobante() {
    const comprobanteDiv = document.getElementById('comprobante-compra');
    if (comprobanteDiv) {
        comprobanteDiv.remove();
    }
}

function descargarComprobante(nombre, email, direccion, metodoPago, total, productosComprados, fechaCompra) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Comprobante de Compra", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${nombre}`, 20, 30);
    doc.text(`Correo Electrónico: ${email}`, 20, 40);
    doc.text(`Dirección: ${direccion}`, 20, 50);
    doc.text(`Fecha: ${fechaCompra}`, 20, 60);
    doc.text(`Método de Pago: ${metodoPago === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'}`, 20, 70);

    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Productos:", 20, 90);
    doc.setFont("helvetica", "normal");

    const productosArray = productosComprados.split('</li>').filter(producto => producto.trim() !== '').map(producto => producto.replace('<li>', '').trim());
    productosArray.forEach((producto, index) => {
        doc.text(`• ${producto}`, 20, 100 + (index * 10));
    });

    const lineaY = 100 + (productosArray.length * 10);
    doc.setLineWidth(0.5);
    doc.line(20, lineaY, 190, lineaY);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${total}`, 20, lineaY + 10 );

    doc.save('comprobante.pdf');
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

function guardarHistorialCompra(nombre, email, direccion, metodoPago, datosTarjeta, total, carrito) {
    const historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
    const nuevaCompra = {
        nombre,
        email,
        direccion,
        metodoPago,
        datosTarjeta,
        total,
        carrito,
        fecha: new Date().toLocaleString()
    };
    historialCompras.push(nuevaCompra);
    localStorage.setItem('historialCompras', JSON.stringify(historialCompras));
}