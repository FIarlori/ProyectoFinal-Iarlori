class Producto {
    constructor(id, nombre, precio, imagen, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
    }
}

const productos = [
    new Producto(1, "iPhone 14", 1200, "iphone-14.png", "smartphones"),
    new Producto(2, "Samsung Galaxy S22", 1000, "s22.png", "smartphones"),
    new Producto(3, "MacBook Air M1", 1500, "macbook-m1.png", "laptops"),
    new Producto(4, "Dell XPS 13", 1400, "dell-xps-13.png", "laptops"),
    new Producto(5, "Auriculares Bose", 300, "bose.png", "accesorios"),
    new Producto(6, "Cargador Rápido", 50, "cargador.png", "accesorios"),
    new Producto(7, "iPad Pro", 1100, "ipad-pro.png", "tablets"),
    new Producto(8, "Samsung Galaxy Tab", 900, "galaxy-tab.png", "tablets"),
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let filtros = { categorias: [], precio: null };

function calcularTotal(precio, cantidad, impuesto = 0.21) {
    return precio * cantidad * (1 + impuesto);
}

function cambiarCantidad(idProducto, categoria, cambio) {
    const cantidadSpan = document.getElementById(`cantidad-${categoria}-${idProducto}`);
    let cantidad = parseInt(cantidadSpan.textContent);
    cantidad = Math.max(0, cantidad + cambio);
    cantidadSpan.textContent = cantidad;
}

function agregarProductoAlCarrito(idProducto, categoria) {
    const productoSeleccionado = productos.find(p => p.id === idProducto && p.categoria === categoria);
    if (!productoSeleccionado) return;

    const cantidadSpan = document.getElementById(`cantidad-${categoria}-${idProducto}`);
    const cantidad = parseInt(cantidadSpan.textContent);

    if (cantidad <= 0) return;

    const identificadorProducto = `${categoria}-${productoSeleccionado.id}`;
    const itemExistente = carrito.find(item => item.identificador === identificadorProducto);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            identificador: identificadorProducto,
            producto: productoSeleccionado,
            categoria: categoria,
            cantidad: cantidad
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    cantidadSpan.textContent = 0;
}

function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';
    let totalGeneral = 0;

    carrito.forEach(item => {
        const totalProducto = calcularTotal(item.producto.precio, item.cantidad);
        const productoDiv = document.createElement('div');
        productoDiv.textContent = `${item.cantidad} x ${item.producto.nombre} - Total: $${totalProducto.toFixed(2)}`;
        carritoDiv.appendChild(productoDiv);
        totalGeneral += totalProducto;
    });

    document.getElementById('total-carrito').textContent = `Total (incluye IVA 21%): $${totalGeneral.toFixed(2)}`;
}

function aplicarFiltros(productos) {
    let productosFiltrados = productos.slice();

    if (filtros.categorias.length > 0) {
        productosFiltrados = productosFiltrados.filter(producto => filtros.categorias.includes(producto.categoria));
    }

    switch (filtros.precio) {
        case 'asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
    }

    return productosFiltrados;
}

function buscarProductos(termino) {
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(termino.toLowerCase()));
    productosFiltrados = aplicarFiltros(productosFiltrados);
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(productos) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = ''; 

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <div class="producto-imagen">
                <img src="./public/images/${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="producto-detalles">
                <p class="producto-nombre">${producto.nombre} - $${producto.precio}</p>
                <div class="producto-acciones">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${producto.id}, '${producto.categoria}', -1)">-</button>
                    <span id="cantidad-${producto.categoria}-${producto.id}">0</span>
                    <button class="cantidad-btn" onclick="cambiarCantidad(${producto.id}, '${producto.categoria}', 1)">+</button>
                    <button class="agregar-btn" onclick="agregarProductoAlCarrito(${producto.id}, '${producto.categoria}')">Agregar al carrito</button>
                </div>
            </div>
        `;
        appDiv.appendChild(productoDiv);
    });
}

function inicializar() {
    document.getElementById('verCarritoBtn').addEventListener('click', mostrarCarrito);
    document.getElementById('menu-icon').addEventListener('click', () => document.getElementById('dropdown-menu').classList.toggle('show'));

    document.getElementById('buscarBtn').addEventListener('click', () => {
        const barraBusqueda = document.getElementById('barraBusqueda');
        barraBusqueda.style.display = barraBusqueda.style.display === 'flex' ? 'none' : 'flex';
    });

    document.getElementById('buscarProducto').addEventListener('input', (event) => buscarProductos(event.target.value));

    document.querySelectorAll('#dropdown-menu .submenu a').forEach(link => {
        link.addEventListener('click', (event) => {
            const categoria = event.target.textContent.toLowerCase();
            if (categoria === 'menor a mayor' || categoria === 'mayor a menor') return;

            const categoriaIndex = filtros.categorias.indexOf(categoria);
            if (categoriaIndex !== -1) {
                filtros.categorias.splice(categoriaIndex, 1);
                event.target.classList.remove('selected');
            } else {
                filtros.categorias.push(categoria);
                event.target.classList.add('selected');
            }

            const productosFiltrados = aplicarFiltros(productos.slice());
            mostrarProductos(productosFiltrados);
        });
    });

    document.getElementById('filtroPrecioAsc').addEventListener('click', () => {
        filtros.precio = filtros.precio === 'asc' ? null : 'asc';
        actualizarFiltros();
    });

    document.getElementById('filtroPrecioDesc').addEventListener('click', () => {
        filtros.precio = filtros.precio === 'desc' ? null : 'desc';
        actualizarFiltros();
    });

    mostrarProductos(productos);
    mostrarCarrito();
}

function actualizarFiltros() {
    const productosFiltrados = aplicarFiltros(productos.slice());
    mostrarProductos(productosFiltrados);
}

inicializar();
