const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalGeneral = 0;
carrito.forEach(item => {
    totalGeneral += item.producto.precio * item.cantidad * 1.21; 
});
document.getElementById('final-total').textContent = totalGeneral.toFixed(2);

const paymentMethodSelect = document.getElementById('payment-method');
const cardDetailsDiv = document.getElementById('card-details');

paymentMethodSelect.addEventListener('change', () => {
    if (paymentMethodSelect.value === 'tarjeta') {
        cardDetailsDiv.style.display = 'block';
    } else {
        cardDetailsDiv.style.display = 'none';
    }
});

document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const paymentMethod = paymentMethodSelect.value;
    const cardDetails = Array.from(cardDetailsDiv.querySelectorAll('input')).map(input => ({
        name: input.previousElementSibling.textContent.replace(':', ''),
        value: input.value
    }));

    let camposIncompletos = [];
    if (!name) camposIncompletos.push('Nombre');
    if (!email) camposIncompletos.push('Correo Electrónico');
    if (!address) camposIncompletos.push('Dirección');
    if (paymentMethod === 'tarjeta') {
        cardDetails.forEach(detail => {
            if (!detail.value) camposIncompletos.push(detail.name);
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
    fetch('../index.html') // Ruta relativa a compra.html
        .then(response => response.text())
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        .catch(error => console.error('Error al cargar la página de inicio:', error));
}