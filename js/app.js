let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let filtros = { categorias: [], precio: null };


function mostrarNotificacion(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50",
        stopOnFocus: true,
        close: true
    }).showToast();
}


function cambiarCantidad(idProducto, categoria, cambio) {
    const cantidadSpan = document.getElementById(`cantidad-${categoria}-${idProducto}`);
    let cantidad = parseInt(cantidadSpan.textContent);
    cantidad = Math.max(1, cantidad + cambio); 
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
    mostrarNotificacion("Producto agregado al carrito");
}


function mostrarProductos(productos) {
    const appDiv = document.getElementById('app');
    
    while (appDiv.firstChild) {
        appDiv.removeChild(appDiv.firstChild);
    }

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        const productoImagen = document.createElement('div');
        productoImagen.classList.add('producto-imagen');
        const imagen = document.createElement('img');
        imagen.src = `./assets/images/${producto.imagen}`;
        imagen.alt = producto.nombre;
        productoImagen.appendChild(imagen);

        const productoDetalles = document.createElement('div');
        productoDetalles.classList.add('producto-detalles');

        const productoNombre = document.createElement('p');
        productoNombre.classList.add('producto-nombre');
        productoNombre.textContent = `${producto.nombre} - $${producto.precio}`;

        const productoAcciones = document.createElement('div');
        productoAcciones.classList.add('producto-acciones');

        const botonDisminuir = document.createElement('button');
        botonDisminuir.classList.add('cantidad-btn');
        botonDisminuir.textContent = '-';
        botonDisminuir.addEventListener('click', () => cambiarCantidad(producto.id, producto.categoria, -1));

        const cantidadSpan = document.createElement('span');
        cantidadSpan.id = `cantidad-${producto.categoria}-${producto.id}`;
        cantidadSpan.textContent = '1';

        const botonAumentar = document.createElement('button');
        botonAumentar.classList.add('cantidad-btn');
        botonAumentar.textContent = '+';
        botonAumentar.addEventListener('click', () => cambiarCantidad(producto.id, producto.categoria, 1));

        const botonAgregar = document.createElement('button');
        botonAgregar.classList.add('agregar-btn', 'agregar-carrito-btn');
        botonAgregar.textContent = 'Agregar al carrito';
        botonAgregar.addEventListener('click', () => agregarProductoAlCarrito(producto.id, producto.categoria));

        productoAcciones.appendChild(botonDisminuir);
        productoAcciones.appendChild(cantidadSpan);
        productoAcciones.appendChild(botonAumentar);
        productoAcciones.appendChild(botonAgregar);

        productoDetalles.appendChild(productoNombre);
        productoDetalles.appendChild(productoAcciones);

        productoDiv.appendChild(productoImagen);
        productoDiv.appendChild(productoDetalles);

        appDiv.appendChild(productoDiv);
    });
}


async function fetchProductos() {
    try {
        const response = await fetch('./db/productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        productos = data;
        mostrarProductos(productos);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '',
            text: 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.'
        });
    }
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


function actualizarFiltros() {
    const productosFiltrados = aplicarFiltros(productos.slice());
    mostrarProductos(productosFiltrados);
}


function buscarProductos(palabra) {
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    productosFiltrados = aplicarFiltros(productosFiltrados);
    mostrarProductos(productosFiltrados);
}


function inicializar() {
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

    fetchProductos();
}


(function() {
    inicializar();
})();
