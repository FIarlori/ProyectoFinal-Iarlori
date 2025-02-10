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
                <li>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}</li>
            `).join('');

            const compraDiv = document.createElement('div');
            compraDiv.classList.add('compra');
            compraDiv.innerHTML = `
                <div class="compra-detalles">
                    <p><strong>Productos:</strong></p>
                    <ul>${productosComprados}</ul>
                </div>
                <div class="compra-info">
                    <div class="fecha-total">
                        <p><strong>Fecha:</strong> ${compra.fecha}</p>
                        <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
                    </div>
                    <div class="boton-comprobante">
                        <button onclick="verComprobante(${historialCompras.length - 1 - index})">Ver Comprobante</button>
                    </div>
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
    if (compra.metodoPago === 'tarjeta') {
        detallesTarjeta = `
            <p><strong>Número de tarjeta:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Número de tarjeta').value}</p>
            <p><strong>Nombre del titular:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Nombre y apellido del titular').value}</p>
            <p><strong>Fecha de vencimiento:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Fecha de vencimiento').value}</p>
            <p><strong>Código de seguridad:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'Código de seguridad').value}</p>
            <p><strong>DNI del titular:</strong> ${compra.datosTarjeta.find(dato => dato.nombre === 'DNI del titular de la tarjeta').value}</p>
        `;
    }

    const productosComprados = compra.carrito.map(item => `
        <li>${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}</li>
    `).join('');

    const comprobanteHTML = `
        <div id="comprobante-compra" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 100%;">
                <h2>Comprobante de Compra</h2>
                <p><strong>Nombre:</strong> ${compra.nombre}</p>
                <p><strong>Correo Electrónico:</strong> ${compra.email}</p>
                <p><strong>Dirección:</strong> ${compra.direccion}</p>
                <p><strong>Fecha:</strong> ${compra.fecha}</p>
                <p><strong>Método de Pago:</strong> ${compra.metodoPago === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'}</p>
                <p><strong>Productos:</strong></p>
                <ul style="text-align: left;">${productosComprados}</ul>
                <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
                <div style="height: 30px;"></div>
                <button onclick="cerrarComprobante()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
                <button onclick="descargarComprobante('${compra.nombre}', '${compra.email}', '${compra.direccion}', '${compra.metodoPago}', '${compra.total}', \`${productosComprados}\`, '${compra.fecha}')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Descargar</button>
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
