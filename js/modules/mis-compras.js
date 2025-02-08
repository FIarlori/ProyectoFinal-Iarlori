mostrarHistorialCompras();

function obtenerHistorialCompras() {
    return JSON.parse(localStorage.getItem("historialCompras")) || [];
}

function mostrarHistorialCompras() {
    const historialCompras = obtenerHistorialCompras();
    const listaComprasDiv = document.getElementById('lista-compras');
    listaComprasDiv.innerHTML = '';

    if (historialCompras.length === 0) {
        const mensajeVacio = document.createElement('div');
        mensajeVacio.classList.add('mensaje-vacio');
        mensajeVacio.textContent = 'No has realizado ninguna compra.';
        listaComprasDiv.appendChild(mensajeVacio);
    } else {
        historialCompras.reverse().forEach((compra, index) => {
            const productosComprados = compra.carrito.map(item => `
                <p>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}</p>
            `).join('');

            const compraDiv = document.createElement('div');
            compraDiv.classList.add('compra');
            compraDiv.innerHTML = `
                <div class="compra-detalles">
                    <p><strong>Productos:</strong>:</p>
                    ${productosComprados}
                    <p><strong>Fecha:</strong> ${compra.fecha}</p>
                    <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
                    
                </div>
                <div class="boton-comprobante">
                    <button onclick="verComprobante(${index})">Ver Comprobante</button>
                </div>
            `;
            listaComprasDiv.appendChild(compraDiv);
        });
    }
}

function verComprobante(index) {
    const historialCompras = obtenerHistorialCompras();
    const compra = historialCompras[index];

    let detallesTarjeta = '';
    if (compra.paymentMethod === 'tarjeta') {
        detallesTarjeta = `
            <p><strong>Número de tarjeta:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Número de tarjeta').value}</p>
            <p><strong>Nombre del titular:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Nombre y apellido del titular').value}</p>
            <p><strong>Fecha de vencimiento:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Fecha de vencimiento').value}</p>
            <p><strong>Código de seguridad:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Código de seguridad').value}</p>
            <p><strong>DNI del titular:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'DNI del titular de la tarjeta').value}</p>
        `;
    }

    const productosComprados = compra.carrito.map(item => `
        <p>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}</p>
    `).join('');

    const comprobanteHTML = `
        <div id="comprobante-compra" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 100%;">
                <h2>Comprobante de Compra</h2>
                <p><strong>Nombre:</strong> ${compra.nombre}</p>
                <p><strong>Correo Electrónico:</strong> ${compra.email}</p>
                <p><strong>Dirección:</strong> ${compra.direccion}</p>
                <p><strong>Método de Pago:</strong> ${compra.paymentMethod === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'}</p>
                ${detallesTarjeta}
                <p><strong>Productos:</strong></p>
                ${productosComprados}
                <p><strong>Total Pagado:</strong> $${compra.total.toFixed(2)}</p>
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
