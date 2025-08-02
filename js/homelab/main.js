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

    menuExpanded = !menuExpanded;

    if (menuExpanded) {
        // Expandir menú
        controls.classList.add('expanded');
        menuToggle.innerHTML = '⚙️';
        menuToggle.classList.remove('expanded');
        menuClosedIndicator.classList.remove('show');
        quickStats.classList.remove('show');

        // Efecto visual
        Utils.vibrate([50]);

        console.log('📱 Menú expandido');
    } else {
        // Contraer menú
        controls.classList.remove('expanded');
        menuToggle.innerHTML = '📱';
        menuToggle.classList.add('expanded');

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
        tools: 'Herramientas'
    };

    document.getElementById('current-category').textContent =
        `Categoría: ${categoryNames[category]}`;

    // Aplicar efecto visual
    Utils.applyGlitchEffect(document.getElementById(`cat-${category}`));

    // Actualizar estadísticas rápidas
    updateQuickStats();

    console.log(`📂 Categoría seleccionada: ${category}`);
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

        // Crear elemento desplegado
        const deployedElement = system.createDeployedItem(currentCategory, currentSurface);

        // Incrementar contador
        itemCount++;
        document.getElementById('item-count').textContent =
            Utils.formatItemCount(itemCount);

        // Actualizar estadísticas rápidas
        updateQuickStats();

        // Obtener información del elemento para efectos
        const item = Utils.getRandomItem(currentCategory);
        const elementPos = deployedElement.getAttribute('position');

        // Mostrar efecto de despliegue
        Utils.showDeploymentEffect(elementPos, item.color);

        // Feedback táctil
        Utils.vibrate([80, 40, 160]);

        console.log(`🚀 Elemento desplegado: ${item.name} (${currentCategory})`);

    } catch (error) {
        console.error('❌ Error al desplegar elemento:', error);
        alert('❌ Error al desplegar elemento. Inténtalo de nuevo.');
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