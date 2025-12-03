// === 1. CARGAR MANGAS ===
async function cargarMangas() {
    try {
        const respuesta = await fetch('/api/mangas');
        const mangas = await respuesta.json();
        const contenedor = document.getElementById('grilla-mangas');
        contenedor.innerHTML = '';

        if (mangas.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; color:#888; width:100%;">Colección vacía.</p>';
            return;
        }

        mangas.forEach(manga => {
            const img = manga.url_portada ? manga.url_portada : 'https://via.placeholder.com/220x320';
            
            const tarjeta = `
                <div class="manga-card">
                    <img src="${img}" class="portada">
                    <div class="info">
                        <h3 class="titulo">${manga.titulo}</h3>
                        <p class="autor">${manga.autor}</p>
                        <span class="estado-badge estado-${manga.estado}">${manga.estado}</span>
                        
                        <div style="display:flex; justify-content:space-between; margin-top:auto; font-size:0.85rem; color:#aaa;">
                            <span>Vol: <b style="color:#fff">${manga.volumen_actual}/${manga.volumenes_totales}</b></span>
                            <span>Cap: <b style="color:#fff">${manga.capitulo_actual}/${manga.capitulos_totales}</b></span>
                        </div>

                        <button class="btn-editar" onclick="abrirModalEditar(${manga.id}, '${manga.titulo}', ${manga.volumen_actual}, ${manga.volumenes_totales}, ${manga.capitulo_actual}, ${manga.capitulos_totales}, '${manga.estado}')">
                            Actualizar
                        </button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });
    } catch (error) { console.error(error); }
}

// === 2. FUNCIÓN PARA LLENAR COMBOBOX (VERSIÓN MEJORADA) ===
function llenarCombo(idSelect, actual, total) {
    const select = document.getElementById(idSelect);
    select.innerHTML = ""; // Limpiar lista anterior
    
    // Opción 0 o "Sin empezar"
    let opcion0 = document.createElement("option");
    opcion0.value = 0;
    opcion0.text = "0 (Inicio)";
    select.add(opcion0);

    // LÓGICA INTELIGENTE:
    // 1. Si la API nos da el total exacto (ej. Naruto tiene 700), usamos ese número.
    // 2. Si la API dice "0" (porque sigue saliendo como One Piece), ponemos 2000 por seguridad.
    let limite = total > 0 ? total : 2000; 

    // Si tu progreso actual es mayor al límite (ej. vas en el 2001), 
    // extendemos la lista automáticamente para que no se rompa.
    if (actual > limite) {
        limite = actual + 50; 
    }

    for (let i = 1; i <= limite; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        
        // Seleccionamos el número en el que vas actualmente
        if (i == actual) option.selected = true;
        
        select.add(option);
    }
}

// === 3. BUSCAR DATOS (PARA EL MODAL CREAR) ===
async function buscarDatosJikan() {
    const titulo = document.getElementById('crear-titulo').value;
    if(!titulo) return alert("Escribe un nombre");

    try {
        const res = await fetch(`https://api.jikan.moe/v4/manga?q=${titulo}&limit=1`);
        const data = await res.json();
        
        if(data.data && data.data.length > 0) {
            const manga = data.data[0];
            
            // Mostrar zona de resultados
            document.getElementById('zona-resultados').style.display = 'block';
            
            // Llenar datos visuales
            document.getElementById('preview-img').src = manga.images.jpg.image_url;
            document.getElementById('preview-autor').innerText = manga.authors[0]?.name || "Desconocido";

            // Guardar datos ocultos
            document.getElementById('crear-url').value = manga.images.jpg.image_url;
            document.getElementById('crear-autor').value = manga.authors[0]?.name || "Desconocido";
            document.getElementById('crear-total-vol').value = manga.volumes || 0;
            document.getElementById('crear-total-cap').value = manga.chapters || 0;

            // GENERAR LOS COMBOBOXES DE CREACIÓN
            llenarCombo('crear-volumen', 0, manga.volumes || 0);
            llenarCombo('crear-capitulo', 0, manga.chapters || 0);

        } else {
            alert("No encontrado");
        }
    } catch (e) { alert("Error al buscar"); }
}

// === 4. GUARDAR NUEVO ===
async function guardarNuevoManga() {
    const nuevo = {
        titulo: document.getElementById('crear-titulo').value,
        autor: document.getElementById('crear-autor').value,
        url_portada: document.getElementById('crear-url').value,
        volumenes_totales: document.getElementById('crear-total-vol').value,
        capitulos_totales: document.getElementById('crear-total-cap').value,
        
        // Lo que elegiste en los comboboxes
        volumen_actual: document.getElementById('crear-volumen').value,
        capitulo_actual: document.getElementById('crear-capitulo').value,
        estado: 'Leyendo'
    };

    await fetch('/api/mangas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
    });
    
    cerrarModalCrear();
    cargarMangas();
    document.getElementById('zona-resultados').style.display = 'none';
    document.getElementById('crear-titulo').value = "";
}

// === 5. EDITAR Y BORRAR ===
function abrirModalEditar(id, titulo, volAct, volTot, capAct, capTot, estado) {
    document.getElementById('modal-editar').style.display = 'flex';
    document.getElementById('modal-id').value = id;
    document.getElementById('modal-titulo-edit').innerText = titulo;
    document.getElementById('modal-estado').value = estado;

    // MAGIA: Llenar los comboboxes con el límite correcto
    llenarCombo('modal-volumen', volAct, volTot);
    llenarCombo('modal-capitulo', capAct, capTot);
}

async function guardarEdicion() {
    const id = document.getElementById('modal-id').value;
    await fetch(`/api/mangas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            volumen_actual: document.getElementById('modal-volumen').value,
            capitulo_actual: document.getElementById('modal-capitulo').value,
            estado: document.getElementById('modal-estado').value
        })
    });
    cerrarModalEditar();
    cargarMangas();
}

async function borrarManga() {
    if(!confirm("¿Borrar?")) return;
    const id = document.getElementById('modal-id').value;
    await fetch(`/api/mangas/${id}`, { method: 'DELETE' });
    cerrarModalEditar();
    cargarMangas();
}

// Funciones Auxiliares
function abrirModalCrear() { document.getElementById('modal-crear').style.display = 'flex'; }
function cerrarModalCrear() { document.getElementById('modal-crear').style.display = 'none'; }
function cerrarModalEditar() { document.getElementById('modal-editar').style.display = 'none'; }

cargarMangas();