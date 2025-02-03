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

document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;
    const paymentMethod = metodoDePago.value;
    const datosTarjeta = Array.from(datosTarjetaDiv.querySelectorAll('input')).map(input => ({
        nombre: input.previousElementSibling.textContent.replace(':', ''),
        value: input.value
    }));

    let camposIncompletos = [];
    if (!nombre) camposIncompletos.push('Nombre');
    if (!email) camposIncompletos.push('Correo Electrónico');
    if (!direccion) camposIncompletos.push('Dirección');
    if (paymentMethod === 'tarjeta') {
        datosTarjeta.forEach(dato => {
            if (!dato.value) camposIncompletos.push(dato.nombre);
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
        Swal.fire({
            icon: 'error',
            title: 'Campos Incompletos',
            text: `Por favor, completa los siguientes campos: ${camposIncompletos.join(', ')}.`
        });
    }
});

function redirigirAInicio() {
    const rutaInicio = '../index.html'; 
    const enlace = document.createElement('a');
    enlace.href = rutaInicio;
    enlace.style.display = 'none'; 
    document.body.appendChild(enlace);
    enlace.click(); 
    document.body.removeChild(enlace); 
}