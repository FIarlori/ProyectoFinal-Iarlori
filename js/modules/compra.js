const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalGeneral = 0;
const metodoDePago = document.getElementById('metodo-pago');
const datosTarjetaDiv = document.getElementById('datos-tarjeta');


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


function validarNombre(input) {
    if (!/^[a-zA-Z\s]+$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El nombre solo debe contener letras.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarEmail(input) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. Por favor ingresa un correo electrónico válido.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarNumeroTarjeta(input) {
    if (!/^\d{14,19}$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. El número de tarjeta debe tener entre 14 y 19 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarNombreTarjeta(input) {
    if (!/^[a-zA-Z\s]+$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El nombre solo debe contener letras.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarFechaExpiracion(input) {
    const [mes, año] = input.value.split('/');
    const fechaActual = new Date();
    const fechaIngresada = new Date(`20${año}`, mes - 1);

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. La fecha de vencimiento debe tener formato mm/yy.');
    } else if (fechaIngresada < fechaActual) {
        mostrarMensajeError(input, 'La fecha de vencimiento ingresada ha expirado. Por favor, ingrese una fecha válida.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarCVC(input) {
    if (!/^\d{3,4}$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. El código de seguridad debe tener entre 3 y 4 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarDNI(input) {
    if (!/^\d{7,10}$/.test(input.value)) {
        mostrarMensajeError(input, 'Campo requerido. El DNI debe tener entre 7 y 10 dígitos.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarDireccion(input) {
    if (!input.value.trim()) {
        mostrarMensajeError(input, 'Campo requerido.');
    } else {
        limpiarMensajeError(input);
    }
}


function validarTelefono(input) {
    if (!/^\d{7,15}$/.test(input.value.trim())) {
        mostrarMensajeError(input, 'Campo requerido. El número de teléfono debe contener únicamente dígitos y tener una longitud de entre 7 y 15 caracteres.');
    } else {
        limpiarMensajeError(input);
    }
}


function guardarHistorialCompra(nombre, email, telefono, direccion, metodoPago, datosTarjeta, total, carrito) {
    const historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
    const nuevaCompra = {
        nombre,
        email,
        telefono,
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


function redirigirAInicio() {
    const rutaInicio = '../index.html';
    const enlace = document.createElement('a');
    enlace.href = rutaInicio;
    enlace.style.display = 'none';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}


function cerrarComprobante() {
    const comprobanteDiv = document.getElementById('comprobante-compra');
    if (comprobanteDiv) {
        comprobanteDiv.remove();
    }
}


function cerrarComprobanteYRedirigir() {
    cerrarComprobante();
    setTimeout(() => {
        redirigirAInicio();
    }, 500);
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

    const productosArray = productosComprados.split('</li>').filter(producto => producto.trim() !== '').map(producto => producto.replace('<li>', '').trim());
    productosArray.forEach((producto, index) => {
        doc.text(`• ${producto}`, 20, 110 + (index * 10));
    });

    const lineaY = 110 + (productosArray.length * 10);
    doc.setLineWidth(0.5);
    doc.line(20, lineaY, 200, lineaY);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${total}`, 20, lineaY + 10);

    doc.save('comprobante.pdf');
}


function mostrarComprobante(nombre, email, telefono, direccion, metodoPago, datosTarjeta, total, carrito) {
    const fechaCompra = new Date().toLocaleString();

    const comprobanteDiv = document.createElement('div');
    comprobanteDiv.id = 'comprobante-compra';
    comprobanteDiv.style.position = 'fixed';
    comprobanteDiv.style.top = '0';
    comprobanteDiv.style.left = '0';
    comprobanteDiv.style.width = '100%';
    comprobanteDiv.style.height = '100%';
    comprobanteDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    comprobanteDiv.style.display = 'flex';
    comprobanteDiv.style.justifyContent = 'center';
    comprobanteDiv.style.alignItems = 'center';
    comprobanteDiv.style.zIndex = '1000';

    const contenidoDiv = document.createElement('div');
    contenidoDiv.style.backgroundColor = 'white';
    contenidoDiv.style.padding = '20px';
    contenidoDiv.style.borderRadius = '10px';
    contenidoDiv.style.maxWidth = '500px';
    contenidoDiv.style.width = '100%';

    const titulo = document.createElement('h2');
    titulo.textContent = 'Comprobante de Compra';
    contenidoDiv.appendChild(titulo);

    const detalles = document.createElement('div');

    function crearParrafo(etiqueta, texto) {
        const parrafo = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${etiqueta}: `;
        parrafo.appendChild(strong);
        parrafo.appendChild(document.createTextNode(texto));
        return parrafo;
    }

    detalles.appendChild(crearParrafo('Nombre', nombre));
    detalles.appendChild(crearParrafo('Correo Electrónico', email));
    detalles.appendChild(crearParrafo('Teléfono', telefono));
    detalles.appendChild(crearParrafo('Dirección', direccion));
    detalles.appendChild(crearParrafo('Fecha', fechaCompra));
    detalles.appendChild(crearParrafo('Método de Pago', metodoPago === 'tarjeta' ? 'Tarjeta de débito / crédito' : 'Efectivo en punto de pago'));

    const productosTitulo = document.createElement('p');
    const strongProductos = document.createElement('strong');
    strongProductos.textContent = 'Productos:';
    productosTitulo.appendChild(strongProductos);
    detalles.appendChild(productosTitulo);

    const productosLista = document.createElement('ul');
    carrito.forEach(item => {
        const productoItem = document.createElement('li');
        productoItem.textContent = `${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}`;
        productosLista.appendChild(productoItem);
    });
    detalles.appendChild(productosLista);

    detalles.appendChild(crearParrafo('Total', `$${total.toFixed(2)}`));

    contenidoDiv.appendChild(detalles);

    const botonCerrar = document.createElement('button');
    botonCerrar.textContent = 'Cerrar';
    botonCerrar.style.padding = '10px 20px';
    botonCerrar.style.backgroundColor = '#4CAF50';
    botonCerrar.style.color = 'white';
    botonCerrar.style.border = 'none';
    botonCerrar.style.borderRadius = '5px';
    botonCerrar.style.cursor = 'pointer';
    botonCerrar.addEventListener('click', cerrarComprobanteYRedirigir);
    contenidoDiv.appendChild(botonCerrar);

    const botonDescargar = document.createElement('button');
    botonDescargar.textContent = 'Descargar';
    botonDescargar.style.padding = '10px 20px';
    botonDescargar.style.backgroundColor = '#007bff';
    botonDescargar.style.color = 'white';
    botonDescargar.style.border = 'none';
    botonDescargar.style.borderRadius = '5px';
    botonDescargar.style.cursor = 'pointer';
    botonDescargar.style.marginLeft = '10px';
    botonDescargar.addEventListener('click', () => {
        descargarComprobante(nombre, email, telefono, direccion, metodoPago, total, carrito.map(item => `${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio.toFixed(2)}`).join('</li><li>'), fechaCompra);
    });
    contenidoDiv.appendChild(botonDescargar);

    comprobanteDiv.appendChild(contenidoDiv);

    document.body.appendChild(comprobanteDiv);
}


function obtenerDatosCompra() {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const metodoPago = metodoDePago.value;

    let datosTarjeta = [];
    if (metodoPago === 'tarjeta') {
        const inputsTarjeta = datosTarjetaDiv.querySelectorAll('input');
        inputsTarjeta.forEach(input => {
            datosTarjeta.push({
                nombre: input.previousElementSibling.textContent.replace(':', '').trim(),
                value: input.value.trim()
            });
        });
    }

    return { nombre, email, direccion, telefono, metodoPago, datosTarjeta };
}


function validarCamposCompra(datos) {
    let errores = [];

    if (!/^[a-zA-Z\s]+$/.test(datos.nombre)) errores.push("Nombre");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) errores.push("Correo Electrónico");
    if (!/^\d{7,15}$/.test(datos.telefono)) errores.push("Número de teléfono");
    if (!datos.direccion.trim()) errores.push("Dirección");

    if (datos.metodoPago === 'tarjeta') {
        datos.datosTarjeta.forEach(dato => {
            switch (dato.nombre) {
                case 'Número de tarjeta':
                    if (!/^\d{14,19}$/.test(dato.value)) errores.push(dato.nombre);
                    break;
                case 'Nombre y apellido del titular':
                    if (!/^[a-zA-Z\s]+$/.test(dato.value)) errores.push(dato.nombre);
                    break;
                case 'Fecha de vencimiento': {
                    const [mes, año] = dato.value.split('/');
                    const fechaActual = new Date();
                    const fechaIngresada = new Date(`20${año}`, mes - 1);
                    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(dato.value) || fechaIngresada < fechaActual) {
                        errores.push(dato.nombre);
                    }
                    break;
                }
                case 'Código de seguridad':
                    if (!/^\d{3,4}$/.test(dato.value)) errores.push(dato.nombre);
                    break;
                case 'DNI del titular de la tarjeta':
                    if (!/^\d{7,10}$/.test(dato.value)) errores.push(dato.nombre);
                    break;
            }
        });
    }

    return errores;
}


function finalizarCompra(datos) {
    guardarHistorialCompra(datos.nombre, datos.email, datos.telefono, datos.direccion, datos.metodoPago, datos.datosTarjeta, totalGeneral, carrito);
    localStorage.removeItem("carrito");
    
    document.getElementById('checkout-form').reset();
    
    const productoCarrito = document.getElementById('producto-carrito');
    if (productoCarrito) {
        while (productoCarrito.firstChild) {
            productoCarrito.removeChild(productoCarrito.firstChild);
        }

        const mensajeVacio = document.createElement('div');
        mensajeVacio.classList.add('mensaje-vacio');
        mensajeVacio.textContent = 'El carrito está vacío';
        productoCarrito.appendChild(mensajeVacio);
    }

    const totalCarrito = document.getElementById('total-carrito');
    if (totalCarrito) {
        totalCarrito.textContent = 'Total (incluye IVA 21%): $0.00';
    }

    mostrarComprobante(datos.nombre, datos.email, datos.telefono, datos.direccion, datos.metodoPago, datos.datosTarjeta, totalGeneral, carrito);
}


function procesarCompra() {
    try {
        const datos = obtenerDatosCompra();
        const errores = validarCamposCompra(datos);

        if (errores.length === 0) {
            Swal.fire({
                icon: 'success',
                title: '¡Gracias por tu compra!',
                showConfirmButton: true,
                allowOutsideClick: true
            }).then(() => {
                finalizarCompra(datos);
            });
        } else {
            throw new Error(`Por favor, completa los siguientes campos:<ul style="text-align: left;">${errores.map(campo => `<li>${campo}</li>`).join('')}</ul>`);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al procesar la compra',
            html: error.message
        });
    }
}


document.getElementById('nombre').addEventListener('blur', (event) => validarNombre(event.target));
document.getElementById('email').addEventListener('input', (event) => event.target.value = event.target.value.replace(/\s+/g, ''));
document.getElementById('email').addEventListener('blur', (event) => validarEmail(event.target));
document.getElementById('numero-tarjeta').addEventListener('input', (event) => event.target.value = event.target.value.replace(/\s+/g, ''));
document.getElementById('numero-tarjeta').addEventListener('blur', (event) => validarNumeroTarjeta(event.target));
document.getElementById('nombre-tarjeta').addEventListener('blur', (event) => validarNombreTarjeta(event.target));
document.getElementById('fecha-expiracion').addEventListener('input', (event) => event.target.value = event.target.value.replace(/\s+/g, ''));
document.getElementById('fecha-expiracion').addEventListener('blur', (event) => validarFechaExpiracion(event.target));
document.getElementById('cvc-tarjeta').addEventListener('input', (event) => event.target.value = event.target.value.replace(/\s+/g, ''));
document.getElementById('cvc-tarjeta').addEventListener('blur', (event) => validarCVC(event.target));
document.getElementById('dni-tarjeta').addEventListener('input', (event) => event.target.value = event.target.value.replace(/\s+/g, ''));
document.getElementById('dni-tarjeta').addEventListener('blur', (event) => validarDNI(event.target));
document.getElementById('direccion').addEventListener('blur', (event) => validarDireccion(event.target));
document.getElementById('telefono').addEventListener('blur', (event) => validarTelefono(event.target));
document.getElementById('telefono').addEventListener('input', (event) => event.target.value = event.target.value.replace(/\s+/g, ''));


metodoDePago.addEventListener('change', () => {
    datosTarjetaDiv.style.display = metodoDePago.value === 'tarjeta' ? 'block' : 'none';
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


carrito.forEach(item => {
    totalGeneral += item.producto.precio * item.cantidad * 1.21;
});

document.getElementById('final-total').textContent = totalGeneral.toFixed(2);