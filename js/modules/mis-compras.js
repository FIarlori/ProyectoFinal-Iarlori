function obtenerHistorialCompras() {
    return JSON.parse(localStorage.getItem("historialCompras")) || [];
}


function cerrarComprobante() {
    const comprobanteDiv = document.getElementById('comprobante-compra');
    if (comprobanteDiv) {
        comprobanteDiv.remove();
    }
}


function descargarComprobante(nombre, email, telefono, direccion, metodoPago, total, productosComprados, fechaCompra) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Comprobante de Compra", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${nombre}`, 20, 30);
    doc.text(`Correo Electrónico: ${email}`, 20, 40);
    doc.text(`Teléfono: ${telefono}`, 20, 50);
    doc.text(`Dirección: ${direccion}`, 20, 60);
    doc.text(`Fecha: ${fechaCompra}`, 20, 70);
    doc.text(`Método de Pago: ${metodoPago === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'}`, 20, 80);

    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    doc.setFont("helvetica", "bold");
    doc.text("Productos:", 20, 100);
    doc.setFont("helvetica", "normal");

    productosComprados.forEach((producto, index) => {
        doc.text(`• ${producto}`, 20, 110 + (index * 10));
    });

    const lineaY = 110 + (productosComprados.length * 10);
    doc.setLineWidth(0.5);
    doc.line(20, lineaY, 200, lineaY);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${total}`, 20, lineaY + 10);

    doc.save('comprobante.pdf');
}


function mostrarHistorialCompras() {
    const historialCompras = obtenerHistorialCompras();
    const listaComprasDiv = document.getElementById('lista-compras');
    
    while (listaComprasDiv.firstChild) {
        listaComprasDiv.removeChild(listaComprasDiv.firstChild);
    }

    if (historialCompras.length === 0) {
        const mensajeVacio = document.createElement('div');
        mensajeVacio.className = 'mensaje-vacio';
        mensajeVacio.textContent = 'No has realizado ninguna compra.';
        listaComprasDiv.appendChild(mensajeVacio);
    } else {
        historialCompras.reverse().forEach((compra, index) => {
    
            const compraDiv = document.createElement('div');
            compraDiv.className = 'compra';

            const compraDetalles = document.createElement('div');
            compraDetalles.className = 'compra-detalles';

            const productosTitulo = document.createElement('p');
            const strongProductos = document.createElement('strong');
            strongProductos.textContent = 'Productos:';
            productosTitulo.appendChild(strongProductos);

            const productosLista = document.createElement('ul');
            compra.carrito.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}`;
                productosLista.appendChild(li);
            });

            compraDetalles.appendChild(productosTitulo);
            compraDetalles.appendChild(productosLista);

            const compraInfo = document.createElement('div');
            compraInfo.className = 'compra-info';

            const fechaTotal = document.createElement('div');
            fechaTotal.className = 'fecha-total';

            const fecha = document.createElement('p');
            const strongFecha = document.createElement('strong');
            strongFecha.textContent = 'Fecha: ';
            fecha.appendChild(strongFecha);
            fecha.appendChild(document.createTextNode(compra.fecha));

            const total = document.createElement('p');
            const strongTotal = document.createElement('strong');
            strongTotal.textContent = 'Total: ';
            total.appendChild(strongTotal);
            total.appendChild(document.createTextNode(`$${compra.total.toFixed(2)}`));

            fechaTotal.appendChild(fecha);
            fechaTotal.appendChild(total);

            const botonComprobante = document.createElement('div');
            botonComprobante.className = 'boton-comprobante';

            const verComprobanteBtn = document.createElement('button');
            verComprobanteBtn.textContent = 'Ver Comprobante';
            verComprobanteBtn.addEventListener('click', () => verComprobante(historialCompras.length - 1 - index));

            botonComprobante.appendChild(verComprobanteBtn);

            compraInfo.appendChild(fechaTotal);
            compraInfo.appendChild(botonComprobante);

            compraDiv.appendChild(compraDetalles);
            compraDiv.appendChild(compraInfo);

            listaComprasDiv.appendChild(compraDiv);
        });
    }
}


function verComprobante(index) {
    const historialCompras = obtenerHistorialCompras();
    const compra = historialCompras[index];

    const comprobanteDiv = document.createElement('div');
    comprobanteDiv.id = 'comprobante-compra';
    Object.assign(comprobanteDiv.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    });

    const comprobanteContenido = document.createElement('div');
    Object.assign(comprobanteContenido.style, {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '100%'
    });

    const crearElementoTexto = (etiqueta, texto, strongText = '') => {
        const elemento = document.createElement(etiqueta);
        if (strongText) {
            const strong = document.createElement('strong');
            strong.textContent = strongText;
            elemento.appendChild(strong);
        }
        elemento.appendChild(document.createTextNode(texto));
        return elemento;
    };

    const titulo = document.createElement('h2');
    titulo.textContent = 'Comprobante de Compra';

    const campos = [
        { etiqueta: 'p', strong: 'Nombre: ', texto: compra.nombre },
        { etiqueta: 'p', strong: 'Correo Electrónico: ', texto: compra.email },
        { etiqueta: 'p', strong: 'Teléfono: ', texto: compra.telefono },
        { etiqueta: 'p', strong: 'Dirección: ', texto: compra.direccion },
        { etiqueta: 'p', strong: 'Fecha: ', texto: compra.fecha },
        { 
            etiqueta: 'p', 
            strong: 'Método de Pago: ', 
            texto: compra.metodoPago === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago' 
        }
    ];

    const productosTitulo = crearElementoTexto('p', '', 'Productos:');
    const productosLista = document.createElement('ul');
    compra.carrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}`;
        productosLista.appendChild(li);
    });

    const total = crearElementoTexto('p', `$${compra.total.toFixed(2)}`, 'Total: ');

    const cerrarBtn = document.createElement('button');
    cerrarBtn.textContent = 'Cerrar';
    Object.assign(cerrarBtn.style, {
        padding: '10px 20px',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    cerrarBtn.addEventListener('click', cerrarComprobante);

    const descargarBtn = document.createElement('button');
    descargarBtn.textContent = 'Descargar';
    Object.assign(descargarBtn.style, {
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px'
    });
    descargarBtn.addEventListener('click', () => {
        const productos = compra.carrito.map(item => 
            `${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}`
        );
        descargarComprobante(
            compra.nombre,
            compra.email,
            compra.telefono,
            compra.direccion,
            compra.metodoPago,
            compra.total,
            productos,
            compra.fecha
        );
    });

    comprobanteContenido.append(
        titulo,
        ...campos.map(campo => crearElementoTexto(campo.etiqueta, campo.texto, campo.strong)),
        productosTitulo,
        productosLista,
        total,
        cerrarBtn,
        descargarBtn
    );

    comprobanteDiv.appendChild(comprobanteContenido);
    document.body.appendChild(comprobanteDiv);
}

mostrarHistorialCompras();