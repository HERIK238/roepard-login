// Variables globales del sistema
let surfaceDetected = false;
let currentSurface = null;
let itemCount = 0;
let isDetecting = false;
let currentCategory = 'services';
let surfaces = [];
let menuExpanded = false;
let menuIndicatorTimeout;

// Inicialización del sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 HomeLab AR - Sistema inicializado');

    // Configurar filtros de consola para reducir ruido
    setupConsoleFilters();

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

    // Configurar event listeners para botones
    setupEventListeners();

    // Mostrar hora actual y actualizar cada segundo
    mostrarHoraColombia();
    setInterval(mostrarHoraColombia, 1000);
});

// Configurar filtros de consola para reducir ruido de extensiones
function setupConsoleFilters() {
    // Interceptar console.error para filtrar errores de extensiones
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // Filtrar errores de extensiones del navegador
        if (message.includes('postMessage on disconnected port') || 
            message.includes('content-script.js') ||
            message.includes('Failed to get subsystem status') ||
            message.includes('Extension context invalidated') ||
            message.includes('Could not establish connection')) {
            return; // No mostrar estos errores
        }
        
        // Mostrar otros errores normalmente
        originalError.apply(console, args);
    };

    // Interceptar console.warn para filtrar advertencias de extensiones
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const message = args.join(' ');
        
        // Filtrar advertencias de extensiones
        if (message.includes('postMessage on disconnected port') ||
            message.includes('Extension context invalidated') ||
            message.includes('Could not establish connection')) {
            return; // No mostrar estas advertencias
        }
        
        // Mostrar otras advertencias normalmente
        originalWarn.apply(console, args);
    };

    // Interceptar console.log para filtrar logs de extensiones
    const originalLog = console.log;
    console.log = function(...args) {
        const message = args.join(' ');
        
        // Filtrar logs de extensiones del navegador
        if (message.includes('postMessage on disconnected port') ||
            message.includes('Extension context invalidated') ||
            message.includes('Could not establish connection')) {
            return; // No mostrar estos logs
        }
        
        // Mostrar otros logs normalmente
        originalLog.apply(console, args);
    };

    console.log('🔇 Filtros de consola configurados para reducir ruido de extensiones');
}

// Configurar event listeners para botones
function setupEventListeners() {
    // Event listener para el botón de despliegue
    const deployBtn = document.getElementById('deploy-btn');
    if (deployBtn) {
        deployBtn.addEventListener('click', (event) => {
            deployItem(event);
        });
    }
    
    // Event listener para el botón de detectar superficie
    const detectBtn = document.getElementById('detect-btn');
    if (detectBtn) {
        detectBtn.addEventListener('click', () => {
            AudioManager.playSound('interface');
            detectSurface();
        });
    }
    
    // Event listener para el botón de limpiar lab
    const clearLabBtn = document.querySelector('button[onclick="clearLab()"]');
    if (clearLabBtn) {
        clearLabBtn.removeAttribute('onclick');
        clearLabBtn.addEventListener('click', () => {
            AudioManager.playSound('delete');
            clearLab();
        });
    }
    
    // Event listener para el botón de debug
    const debugBtn = document.querySelector('button[onclick="checkSystemStatus()"]');
    if (debugBtn) {
        debugBtn.removeAttribute('onclick');
        debugBtn.addEventListener('click', checkSystemStatus);
    }
    
    // Event listener para el botón de reset
    const resetBtn = document.querySelector('button[onclick="resetSystemState()"]');
    if (resetBtn) {
        resetBtn.removeAttribute('onclick');
        resetBtn.addEventListener('click', () => {
            AudioManager.playSound('reset');
            resetSystemState();
        });
    }
    
    // Event listener para el botón de menú 3D
    const menu3dBtn = document.querySelector('button[onclick="toggleFloatingMenu()"]');
    if (menu3dBtn) {
        menu3dBtn.removeAttribute('onclick');
        menu3dBtn.addEventListener('click', toggleFloatingMenu);
    }
    
    // Event listener para el botón de menú toggle
    const menuToggleBtn = document.querySelector('button[onclick="toggleMenu()"]');
    if (menuToggleBtn) {
        menuToggleBtn.removeAttribute('onclick');
        menuToggleBtn.addEventListener('click', toggleMenu);
    }
    
    console.log('🎯 Event listeners configurados');
}

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

    // Asegurar que el menú 3D esté oculto al inicio
    hideFloatingMenu();

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

    // Sincronizar variables globales al iniciar
    setTimeout(() => {
        syncGlobalVariables();
        console.log('🔄 Variables globales sincronizadas al iniciar AR');
    }, 1000);

    alertify.success('🚀 HomeLab AR inicializado', 2);
}

// Alternar visibilidad del menú
function toggleMenu() {
    const controls = document.getElementById('controls');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClosedIndicator = document.getElementById('menu-closed-indicator');
    const quickStats = document.getElementById('quick-stats');
    const pagesPanel = document.getElementById('pages-panel');

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
            tools: 'Herramientas',
            pages: 'Páginas'
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
        alertify.warning('⏳ Detección de superficie en progreso', 2);
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
            
            // Sincronizar variables globales después de detectar superficie
            setTimeout(() => {
                syncGlobalVariables();
                console.log('🔄 Variables sincronizadas después de detectar superficie');
            }, 500);
            
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
        alertify.error('❌ Error en detección', 3);
    }
}

// Limpiar laboratorio
function clearLab() {
    if (itemCount === 0) {
        alertify.message('El laboratorio ya está vacío', 2);
        return;
    }

    Swal.fire({
        title: '¿Reiniciar Laboratorio?',
        html: `Se eliminarán <b>${itemCount}</b> elementos. <br>¡Esta acción no se puede deshacer!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'Cancelar',
        background: '#1e1e1e',
        color: '#ffffff'
    }).then((result) => {
        if (result.isConfirmed) {
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

                Swal.fire(
                    '¡Reiniciado!',
                    'El laboratorio ha sido limpiado.',
                    'success'
                );

            } catch (error) {
                console.error('❌ Error al limpiar laboratorio:', error);
                Swal.fire(
                    '¡Error!',
                    'No se pudo reiniciar el laboratorio.',
                    'error'
                );
            }
        }
    });
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

// Seleccionar categoría de elementos
function selectCategory(category) {
    // Verificar categoría válida
    if (!homelabItems[category]) {
        console.warn(`⚠️ Categoría no válida: ${category}`);
        return;
    }

    AudioManager.playSound('interface');
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

// Función para mostrar hora actual en Colombia
function mostrarHoraColombia() {
    const horaColombia = moment().tz("America/Bogota").format("HH:mm:ss YYYY-MM-DD Z");
    const uamDate = document.getElementById("uam-date");
    if (uamDate) {
        uamDate.textContent = horaColombia;
    }
}

// Función para mostrar el menú 3D flotante
function showFloatingMenu() {
    const floatingMenu = document.getElementById('floating-menu-3d');
    if (floatingMenu) {
        floatingMenu.setAttribute('visible', true);
        console.log('🎛️ Menú 3D flotante mostrado');
    }
}

// Función para ocultar el menú 3D flotante
function hideFloatingMenu() {
    const floatingMenu = document.getElementById('floating-menu-3d');
    if (floatingMenu) {
        floatingMenu.setAttribute('visible', false);
        console.log('🎛️ Menú 3D flotante oculto');
    }
}

// Función para alternar la visibilidad del menú 3D flotante
function toggleFloatingMenu() {
    const floatingMenu = document.getElementById('floating-menu-3d');
    if (floatingMenu) {
        const isVisible = floatingMenu.getAttribute('visible');
        if (isVisible) {
            hideFloatingMenu();
        } else {
            showFloatingMenu();
        }
    }
}

// Función para reinicializar el estado del sistema
function resetSystemState() {
    console.log('🔄 Reinicializando estado del sistema...');
    
    // Limpiar variables globales
    surfaceDetected = false;
    currentSurface = null;
    itemCount = 0;
    surfaces = [];
    
    // Ocultar menú 3D flotante
    hideFloatingMenu();
    
    // Sincronizar con el sistema AR
    syncGlobalVariables();
    
    // Actualizar UI
    const deployBtn = document.getElementById('deploy-btn');
    if (deployBtn) {
        deployBtn.disabled = true;
    }
    
    const statusElement = document.getElementById('surface-status');
    if (statusElement) {
        statusElement.innerHTML = '🔍 Inicializando escáner de superficies...';
    }
    
    // Actualizar contadores
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
        itemCountElement.textContent = Utils.formatItemCount(0);
    }
    
    const surfaceCountElement = document.getElementById('surface-count');
    if (surfaceCountElement) {
        surfaceCountElement.textContent = Utils.formatSurfaceCount(0);
    }
    
    console.log('✅ Estado del sistema reinicializado');
    checkSystemStatus();
}

// Función para sincronizar variables globales con el sistema AR
function syncGlobalVariables() {
    const scene = document.querySelector('a-scene');
    if (scene && scene.systems['homelab']) {
        const system = scene.systems['homelab'];
        
        // Sincronizar variables de superficie
        if (system.detectedSurfaces && system.detectedSurfaces.length > 0) {
            surfaceDetected = true;
            currentSurface = system.detectedSurfaces[system.detectedSurfaces.length - 1];
            surfaces = [...system.detectedSurfaces];
            
            console.log('🔄 Variables globales sincronizadas:', {
                surfaceDetected,
                currentSurface: currentSurface ? 'existe' : 'no existe',
                surfacesCount: surfaces.length
            });
        }
        
        // Sincronizar contador de elementos
        if (system.deployedItems) {
            itemCount = system.deployedItems.length;
            console.log('🔄 Contador de elementos sincronizado:', itemCount);
        }
    }
}

// Función para verificar el estado actual del sistema
function checkSystemStatus() {
    console.log('🔍 Estado del sistema HomeLab AR:', {
        surfaceDetected: surfaceDetected,
        currentSurface: currentSurface ? 'existe' : 'no existe',
        surfacesCount: surfaces.length,
        itemCount: itemCount,
        currentCategory: currentCategory,
        menuExpanded: menuExpanded
    });
    
    // Verificar variables globales del sistema AR
    const scene = document.querySelector('a-scene');
    if (scene && scene.systems['homelab']) {
        const system = scene.systems['homelab'];
        console.log('🔍 Estado del sistema AR:', {
            detectedSurfaces: system.detectedSurfaces.length,
            deployedItems: system.deployedItems.length,
            isScanning: system.isScanning
        });
    }
}

// Desplegar elemento en superficie
function deployItem(event = null) {
    // Debug: verificar estado antes del despliegue
    console.log('🚀 Intentando desplegar elemento...', event);
    checkSystemStatus();
    
    // Verificar que haya superficie detectada
    if (!surfaceDetected || !currentSurface) {
        alertify.error('❌ Escanea una superficie primero', 3);
        console.warn('⚠️ Intento de despliegue sin superficie detectada');
        return;
    }

    // Verificar categoría válida
    if (!homelabItems[currentCategory]) {
        alertify.warning('⚠️ Categoría no válida', 2);
        console.error('❌ Categoría inválida:', currentCategory);
        return;
    }

    try {
        AudioManager.playSound('object');
        // Obtener sistema AR
        const system = document.querySelector('a-scene').systems['homelab'];
        
        // Para páginas, usar página seleccionada
        if (currentCategory === 'pages') {
            const selectedPageId = localStorage.getItem('selectedPage');
            const selectedPage = availablePages.find(p => p.id === selectedPageId) || availablePages[0];
            
            if (!selectedPage) {
                alertify.error('❌ No hay páginas disponibles', 3);
                return;
            }
            
            // Obtener posición en la superficie
            const surfacePos = currentSurface.getAttribute('position');
            const itemPosition = Utils.getRandomSurfacePosition(surfacePos, 1.5);
            itemPosition.y += 0.5; // Ajustar altura para páginas
            
            // Crear página interactiva
            const pageData = {
                name: selectedPage.title.replace(/[^\w\s]/g, ''),
                emoji: selectedPage.title.match(/^[^\w\s]+/)?.[0] || '📄',
                description: selectedPage.description,
                color: '#4A90E2',
                url: `../pages/${selectedPage.file}`
            };
            
            system.createInteractivePage(pageData, 
                `${itemPosition.x} ${itemPosition.y} ${itemPosition.z}`);
            
        } else {
            // Comportamiento normal para otras categorías
            system.createDeployedItem(currentCategory, currentSurface);
        }

        // Incrementar contador
        itemCount++;
        document.getElementById('item-count').textContent =
            Utils.formatItemCount(itemCount);

        // Actualizar estadísticas rápidas
        updateQuickStats();

        // Feedback táctil
        Utils.vibrate([80, 40, 160]);

        // Mostrar notificación de éxito
        const itemName = currentCategory === 'pages' ? 'Página' : 'Elemento';
        alertify.success(`✅ ${itemName} desplegado`, 2);

        console.log(`🚀 Elemento desplegado: ${currentCategory}`);
        
        // Debug: verificar estado después del despliegue
        checkSystemStatus();

    } catch (error) {
        console.error('❌ Error al desplegar elemento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Despliegue',
            text: 'No se pudo desplegar el elemento. Inténtalo de nuevo.',
            background: '#1e1e1e',
            color: '#ffffff'
        });
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