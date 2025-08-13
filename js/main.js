// Variables globales del sistema
let surfaceDetected = false;
let currentSurface = null;
let itemCount = 0;
let isDetecting = false;
let currentCategory = 'services';
let surfaces = [];
let menuExpanded = false;
let menuIndicatorTimeout;
let xrHitTestSource = null;
let xrRefSpace = null;
let selectionTimer = null;
let selectionStartTime = null;
let currentSelectionTarget = null;

// Inicialización del sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 HomeLab AR - Sistema inicializado');

    // Verificar compatibilidad WebXR si está disponible
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
            if (supported) {
                console.log('✅ WebXR AR soportado');
            }
        }).catch(() => {
            console.log('ℹ️ WebXR no disponible, usando cámara estándar');
        });
    }

    // Inicializar lista de páginas
    initializePagesList();

    // Mostrar hora actual y actualizar cada segundo
    mostrarHoraColombia();
    setInterval(mostrarHoraColombia, 1000);
});

// Función principal para iniciar AR
function startAR() {
    // Ocultar overlay inicial
    document.getElementById('overlay').classList.add('hide');

    // Mostrar detector de superficie
    document.getElementById('surface-detector').classList.remove('hide');

    // Mostrar botón de menú y estadísticas
    document.getElementById('menu-toggle').classList.remove('hide');
    document.getElementById('quick-stats').classList.remove('hide');

    // Mostrar controles expandidos inicialmente
    document.getElementById('controls').classList.remove('hide');
    document.getElementById('controls').classList.add('expanded');
    menuExpanded = true;

    // Auto-minimizar después de 5 segundos
    setTimeout(() => {
        if (menuExpanded) {
            toggleMenu();
        }
    }, 5000);

    // Actualizar estado
    document.getElementById('surface-status').innerHTML =
        '📡 <span style="color: #00ff88;">HomeLab AR activado</span> - Busca una superficie plana';

    // Mostrar indicador de menú brevemente
    showMenuIndicator();

    // Inicializar sistema de cámara
    initializeCameraSystem();

    console.log('🚀 HomeLab AR inicializado - Listo para desplegar');
}

// Alternar visibilidad del menú
function toggleMenu() {
    const controls = document.getElementById('controls');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClosedIndicator = document.getElementById('menu-closed-indicator');
    const quickStats = document.getElementById('quick-stats');
    const pagesPanel = document.getElementById('pages-panel'); // Panel de páginas

    menuExpanded = !menuExpanded;

    if (menuExpanded) {
        // Expandir menú
        controls.classList.add('expanded');
        menuToggle.innerHTML = '⚙️';
        menuToggle.classList.remove('expanded');
        menuClosedIndicator.classList.remove('show');
        quickStats.classList.remove('show');

        // Mostrar panel de páginas si la categoría actual es 'pages'
        if (currentCategory === 'pages') {
            pagesPanel.classList.remove('hide');
        }

        // Efecto visual
        Utils.vibrate([50]);

        console.log('📱 Menú expandido');
    } else {
        // Contraer menú
        controls.classList.remove('expanded');
        menuToggle.innerHTML = '📱';
        menuToggle.classList.add('expanded');

        // Ocultar panel de páginas cuando se contrae el menú
        pagesPanel.classList.add('hide');

        // Mostrar indicadores laterales después de un momento
        setTimeout(() => {
            menuClosedIndicator.classList.add('show');
            quickStats.classList.add('show');
            updateQuickStats();
        }, 200);

        // Efecto visual
        Utils.vibrate([30, 30]);

        console.log('📱 Menú contraído');
    }
}

// Mostrar indicador de menú
function showMenuIndicator() {
    const indicator = document.getElementById('menu-indicator');

    // Limpiar timeout anterior si existe
    if (menuIndicatorTimeout) {
        clearTimeout(menuIndicatorTimeout);
    }

    indicator.classList.add('show');

    menuIndicatorTimeout = setTimeout(() => {
        indicator.classList.remove('show');
    }, 3000);
}

// Actualizar estadísticas rápidas
function updateQuickStats() {
    if (!menuExpanded) {
        document.getElementById('quick-items').textContent = `📦 ${itemCount} elementos`;
        document.getElementById('quick-surfaces').textContent = `🎯 ${surfaces.length} superficies`;

        const categoryNames = {
            services: 'Servicios',
            pets: 'Mascotas',
            games: 'Juegos',
            tools: 'Herramientas'
        };

        document.getElementById('quick-category').textContent = `📂 ${categoryNames[currentCategory]}`;
    }
}

// Inicializar sistema de cámara
function initializeCameraSystem() {
    const scene = document.getElementById('scene');

    // Esperar a que A-Frame esté completamente cargado
    scene.addEventListener('loaded', () => {
        console.log('📷 Sistema de cámara AR inicializado');

        // Configurar eventos de cámara si es necesario
        const camera = document.getElementById('cameraRig');
        if (camera) {
            // Eventos de cámara pueden ir aquí
            console.log('📷 Cámara AR lista');
        }
    });
}

// Función para ocultar manualmente el detector de superficie
function hideSurfaceDetector() {
    document.getElementById('surface-detector').classList.add('hide');
    console.log('🔍 Detector de superficie oculto manualmente');
}

// Detectar superficie
async function detectSurface() {
    if (isDetecting) {
        console.log('⏳ Ya se está ejecutando una detección de superficie');
        return;
    }

    isDetecting = true;
    const detectBtn = document.getElementById('detect-btn');

    // Actualizar UI del botón
    detectBtn.disabled = true;
    detectBtn.textContent = '🔄 Escaneando...';

    try {
        // Mostrar detector de superficie
        document.getElementById('surface-detector').classList.remove('hide');
        console.log('🔍 Iniciando detección de superficie...');

        // Limpiar superficie anterior si existe
        if (currentSurface) {
            currentSurface.setAttribute('animation__fadeout',
                'property: material.opacity; to: 0; dur: 800');
            setTimeout(() => {
                if (currentSurface.parentNode) {
                    currentSurface.parentNode.removeChild(currentSurface);
                }
            }, 800);
        }

        // Ejecutar detección
        const system = document.querySelector('a-scene').systems['homelab'];
        const detected = await system.simulateSurfaceDetection();

        if (detected) {
            // Ocultar detector de superficie automáticamente
            setTimeout(() => {
                document.getElementById('surface-detector').classList.add('hide');
            }, 1000);
            // Actualizar botón con éxito
            detectBtn.textContent = '✅ Superficie Lista';

            // Restaurar botón después de un tiempo
            setTimeout(() => {
                detectBtn.disabled = false;
                detectBtn.textContent = '📡 Nueva Superficie';
                isDetecting = false;
            }, 2500);

            console.log('✅ Superficie detectada correctamente');
        }
    } catch (error) {
        console.error('❌ Error en detección de superficie:', error);

        // Restaurar botón en caso de error
        detectBtn.disabled = false;
        detectBtn.textContent = '📡 Escanear Superficie';
        isDetecting = false;

        // Mostrar error al usuario
        document.getElementById('surface-status').innerHTML =
            '❌ <span style="color: #ff4444;">Error en detección - Inténtalo de nuevo</span>';
    }
}

// Limpiar laboratorio
function clearLab() {
    // Confirmación del usuario
    if (itemCount > 0) {
        if (!confirm(`¿Estás seguro de que quieres reiniciar el laboratorio? Se eliminarán ${itemCount} elementos.`)) {
            return;
        }
    }

    try {
        // Obtener sistema AR y limpiar
        const system = document.querySelector('a-scene').systems['homelab'];
        system.clearLaboratory();

        // Actualizar estado global
        itemCount = 0;

        // Actualizar UI
        document.getElementById('item-count').textContent =
            Utils.formatItemCount(itemCount);
        document.getElementById('surface-count').textContent =
            Utils.formatSurfaceCount(surfaces.length);
        document.getElementById('surface-status').innerHTML =
            '🧹 <span style="color: #00ff88;">Laboratorio reiniciado</span> - Listo para nuevos despliegues';

        // Actualizar estadísticas rápidas
        updateQuickStats();

        console.log('🗑️ Laboratorio HomeLab reiniciado completamente');

    } catch (error) {
        console.error('❌ Error al limpiar laboratorio:', error);
        alert('❌ Error al reiniciar laboratorio. Recarga la página si persiste.');
    }
}

// Inicializar lista de páginas disponibles
function initializePagesList() {
    const pagesList = document.getElementById('pages-list');
    pagesList.innerHTML = '';
    
    availablePages.forEach(page => {
        const pageItem = document.createElement('div');
        pageItem.className = 'page-item';
        pageItem.dataset.pageId = page.id;
        pageItem.innerHTML = `
            <div class="page-title">${page.title}</div>
            <div class="page-description">${page.description}</div>
        `;
        
        pageItem.addEventListener('click', () => {
            // Marcar como seleccionado
            document.querySelectorAll('.page-item').forEach(item => {
                item.classList.remove('selected');
            });
            pageItem.classList.add('selected');
            
            // Guardar selección
            localStorage.setItem('selectedPage', page.id);
        });
        
        pagesList.appendChild(pageItem);
    });
    
    // Seleccionar la primera página por defecto
    if (availablePages.length > 0) {
        document.querySelector('.page-item').classList.add('selected');
        localStorage.setItem('selectedPage', availablePages[0].id);
    }
}

// Mostrar/ocultar panel de páginas
function togglePagesPanel() {
    const pagesPanel = document.getElementById('pages-panel');
    pagesPanel.classList.toggle('hide');
}


// Seleccionar categoría de elementos
function selectCategory(category) {
    // Verificar categoría válida
    if (!homelabItems[category]) {
        console.warn(`⚠️ Categoría no válida: ${category}`);
        return;
    }

    currentCategory = category;

    // Actualizar botones de categoría
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`cat-${category}`).classList.add('active');

    // Actualizar texto de categoría actual
    const categoryNames = {
        services: 'Servicios',
        pets: 'Mascotas',
        games: 'Juegos',
        tools: 'Herramientas',
        pages: 'Páginas'
    };

    document.getElementById('current-category').textContent =
        `Categoría: ${categoryNames[category]}`;

    // Mostrar/ocultar panel de páginas según la categoría
    const pagesPanel = document.getElementById('pages-panel');
    if (category === 'pages') {
        pagesPanel.classList.remove('hide');
    } else {
        pagesPanel.classList.add('hide');
    }

    // Aplicar efecto visual
    Utils.applyGlitchEffect(document.getElementById(`cat-${category}`));

    // Actualizar estadísticas rápidas
    updateQuickStats();

    console.log(`📂 Categoría seleccionada: ${category}`);
}

// Agregar función para mostrar hora actual
function mostrarHoraColombia() {
    // Obtener la hora actual en Colombia
    const horaColombia = moment().tz("America/Bogota").format("HH:mm:ss YYYY-MM-DD Z");
    const uamDate = document.getElementById("uam-date");
    if (uamDate) {
        uamDate.textContent = horaColombia;
    }
}

// Desplegar elemento en superficie
function deployItem() {
    // Verificar que haya superficie detectada
    if (!surfaceDetected || !currentSurface) {
        alert('❌ Primero escanea una superficie para desplegar elementos');
        console.warn('⚠️ Intento de despliegue sin superficie detectada');
        return;
    }

    // Verificar categoría válida
    if (!homelabItems[currentCategory]) {
        alert('❌ Categoría no válida seleccionada');
        console.error('❌ Categoría inválida:', currentCategory);
        return;
    }

    try {
        // Obtener sistema AR
        const system = document.querySelector('a-scene').systems['homelab'];
        
        // Para páginas, usar página seleccionada
        if (currentCategory === 'pages') {
            const selectedPageId = localStorage.getItem('selectedPage');
            const selectedPage = availablePages.find(p => p.id === selectedPageId) || availablePages[0];
            
            if (!selectedPage) {
                alert('❌ No hay páginas disponibles');
                return;
            }
            
            // Obtener posición en la superficie
            const surfacePos = currentSurface.getAttribute('position');
            const itemPosition = Utils.getRandomSurfacePosition(surfacePos, 1.5);
            itemPosition.y += 0.5; // Ajustar altura para páginas
            
            // Crear página interactiva
            const pageData = {
                name: selectedPage.title.replace(/[^\w\s]/g, ''), // Remover emojis
                emoji: selectedPage.title.match(/^[^\w\s]+/)?.[0] || '📄',
                description: selectedPage.description,
                color: '#4A90E2',
                url: `../pages/${selectedPage.file}`
            };
            
            const deployedElement = system.createInteractivePage(pageData, 
                `${itemPosition.x} ${itemPosition.y} ${itemPosition.z}`);
            
        } else {
            // Comportamiento normal para otras categorías
            const deployedElement = system.createDeployedItem(currentCategory, currentSurface);
        }

        // Incrementar contador
        itemCount++;
        document.getElementById('item-count').textContent =
            Utils.formatItemCount(itemCount);

        // Actualizar estadísticas rápidas
        updateQuickStats();

        // Feedback táctil
        Utils.vibrate([80, 40, 160]);

        console.log(`🚀 Elemento desplegado: ${currentCategory}`);

    } catch (error) {
        console.error('❌ Error al desplegar elemento:', error);
        alert('❌ Error al desplegar elemento. Inténtalo de nuevo.');
    }
}

function startSelectionDetection() {
    const scene = document.querySelector('a-scene');
    const cursor = document.getElementById('cursor');
    const selectionIndicator = document.getElementById('selection-indicator');
    const selectionTimerEl = document.getElementById('selection-timer');
    
    // Evento cuando el cursor intersecta con un elemento
    scene.addEventListener('raycaster-intersection', function(evt) {
        const intersectedEl = evt.detail.els[0];
        if (intersectedEl && intersectedEl.classList.contains('interactive')) {
            currentSelectionTarget = intersectedEl;
            selectionIndicator.classList.remove('hide');
            
            // Iniciar temporizador
            selectionStartTime = Date.now();
            updateSelectionTimer();
            
            // Iniciar actualización del temporizador
            selectionTimer = setInterval(updateSelectionTimer, 100);
        }
    });
    
    // Evento cuando el cursor deja de intersectar
    scene.addEventListener('raycaster-intersection-cleared', function(evt) {
        clearSelectionTimer();
        selectionIndicator.classList.add('hide');
        currentSelectionTarget = null;
    });
    
    // Función para actualizar el temporizador
    function updateSelectionTimer() {
        if (!selectionStartTime || !currentSelectionTarget) return;
        
        const elapsed = Date.now() - selectionStartTime;
        const remaining = Math.max(0, 3000 - elapsed);
        const seconds = Math.ceil(remaining / 1000);
        
        selectionTimerEl.textContent = `${seconds}s`;
        
        // Cambiar color según tiempo restante
        const dot = document.querySelector('.selection-dot');
        if (seconds <= 1) {
            dot.style.background = '#ff4444';
            dot.style.boxShadow = '0 0 15px #ff4444';
        } else {
            dot.style.background = '#00ff88';
            dot.style.boxShadow = '0 0 15px #00ff88';
        }
        
        // Activar selección después de 3 segundos
        if (elapsed >= 3000) {
            activateSelection();
        }
    }
    
    // Función para limpiar el temporizador
    function clearSelectionTimer() {
        if (selectionTimer) {
            clearInterval(selectionTimer);
            selectionTimer = null;
        }
        selectionStartTime = null;
        selectionTimerEl.textContent = '';
    }
    
    // Función para activar la selección
    function activateSelection() {
        if (!currentSelectionTarget) return;
        
        // Efecto visual
        currentSelectionTarget.setAttribute('animation__select', {
            property: 'scale',
            to: '1.2 1.2 1.2',
            dur: 200,
            dir: 'alternate'
        });
        
        // Activar el elemento (simular clic)
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        currentSelectionTarget.dispatchEvent(clickEvent);
        
        // Feedback táctil
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }
        
        // Limpiar selección
        clearSelectionTimer();
        selectionIndicator.classList.add('hide');
        currentSelectionTarget = null;
    }
}



// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('❌ Error global de HomeLab AR:', event.error);
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesa rechazada en HomeLab AR:', event.reason);
});

// Log de finalización de carga
console.log('✅ HomeLab AR - Todos los scripts cargados correctamente');