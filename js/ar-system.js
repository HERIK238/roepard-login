// Sistema AR del HomeLab

// Registrar sistema principal del HomeLab
AFRAME.registerSystem('homelab', {
    init: function () {
        this.detectedSurfaces = [];
        this.deployedItems = [];
        this.cameraEl = document.querySelector('[camera]');
        this.isScanning = false;
        this.xrHitTestSource = null;
        this.xrRefSpace = null;
        this.performanceMetrics = {
            lastFrameTime: 0,
            frameCount: 0,
            averageFrameTime: 0
        };
        
        console.log('🏠 Sistema HomeLab AR inicializado');
        
        // Inicializar WebXR si está disponible
        this.initWebXR();
        
        // Configurar monitoreo de rendimiento
        this.setupPerformanceMonitoring();
    },

    // Configurar monitoreo de rendimiento
    setupPerformanceMonitoring: function() {
        const sceneEl = this.el;
        
        sceneEl.addEventListener('renderstart', () => {
            this.performanceMetrics.lastFrameTime = performance.now();
        });
        
        sceneEl.addEventListener('render', () => {
            const currentTime = performance.now();
            const frameTime = currentTime - this.performanceMetrics.lastFrameTime;
            
            this.performanceMetrics.frameCount++;
            this.performanceMetrics.averageFrameTime = 
                (this.performanceMetrics.averageFrameTime * (this.performanceMetrics.frameCount - 1) + frameTime) / this.performanceMetrics.frameCount;
            
            this.performanceMetrics.lastFrameTime = currentTime;
            
            // Log de rendimiento cada 100 frames
            if (this.performanceMetrics.frameCount % 100 === 0) {
                console.log(`📊 Rendimiento AR: ${this.performanceMetrics.averageFrameTime.toFixed(2)}ms por frame`);
            }
        });
    },

    // Inicializar WebXR
    initWebXR: function() {
        const sceneEl = this.el;
        
        if (!navigator.xr) {
            console.log('ℹ️ WebXR no disponible en este dispositivo');
            return;
        }
        
        sceneEl.addEventListener('enter-vr', () => {
            console.log('🚪 Entrando a modo VR/WebXR');
            this.setupXRHitTest();
        });
        
        sceneEl.addEventListener('exit-vr', () => {
            console.log('🚪 Saliendo de modo VR/WebXR');
            this.xrHitTestSource = null;
        });
    },

    // Configurar hit testing para WebXR
    setupXRHitTest: function() {
        const sceneEl = this.el;
        const xrCamera = sceneEl.camera;
        
        if (!xrCamera) {
            console.warn('⚠️ Cámara XR no disponible');
            return;
        }
        
        try {
            sceneEl.renderer.xr.getSession().then((session) => {
                session.requestReferenceSpace('local').then((refSpace) => {
                    this.xrRefSpace = refSpace;
                    
                    session.requestHitTestSource({
                        space: this.xrRefSpace
                    }).then((hitTestSource) => {
                        this.xrHitTestSource = hitTestSource;
                        console.log('🎯 WebXR Hit Test activo');
                    }).catch((e) => {
                        console.warn('⚠️ Error al configurar Hit Test Source:', e);
                    });
                }).catch((e) => {
                    console.warn('⚠️ Error al solicitar Reference Space:', e);
                });
            }).catch((e) => {
                console.warn('⚠️ Error al obtener sesión XR:', e);
            });
        } catch (error) {
            console.warn('⚠️ WebXR Hit Test no disponible:', error);
        }
    },

    // Simular detección de superficie con fases realistas
    async simulateSurfaceDetection() {
        if (this.isScanning) {
            console.log('⏳ Escaneo ya en progreso');
            return false;
        }

        this.isScanning = true;
        console.log('🔍 Iniciando simulación de detección de superficie');

        return new Promise((resolve) => {
            let progress = 0;
            const phases = [
                'Calibrando sensores',
                'Analizando geometría',
                'Detectando planos',
                'Validando superficie',
                'Creando superficie AR'
            ];
            let currentPhase = 0;

            const interval = setInterval(() => {
                progress += 8;

                // Cambiar de fase cada 20% de progreso
                if (progress % 20 === 0 && currentPhase < phases.length - 1) {
                    currentPhase++;
                    console.log(`🔄 Fase de detección: ${phases[currentPhase]}`);
                }

                // Actualizar UI con progreso
                const statusElement = document.getElementById('surface-status');
                if (statusElement) {
                    statusElement.innerHTML =
                        `🔄 <span style="color: #FFD700;">${phases[currentPhase]}... ${progress}%</span>`;
                }

                // Completar cuando llega al 100%
                if (progress >= 100) {
                    clearInterval(interval);
                    console.log('✅ Simulación de detección completada');
                    this.createDetectedSurface();
                    this.isScanning = false;
                    resolve(true);
                }
            }, 120);
        });
    },

    // Crear superficie detectada con efectos holográficos
    createDetectedSurface: function() {
        try {
            const surfacePosition = Utils.calculateSurfacePosition(this.cameraEl);
            console.log('📍 Posición de superficie calculada:', surfacePosition);

            // Crear elemento principal de superficie
            const surface = document.createElement('a-entity');
            surface.setAttribute('id', `surface-${this.detectedSurfaces.length}`);
            surface.setAttribute('mixin', 'detected-surface');
            surface.setAttribute('position',
                `${surfacePosition.x} ${surfacePosition.y} ${surfacePosition.z}`);
            surface.setAttribute('rotation', '-90 0 0');
            surface.setAttribute('class', 'detected-surface surface-target');

            // Animaciones de aparición
            surface.setAttribute('animation__appear',
                'property: material.opacity; from: 0; to: 0.15; dur: 1500');
            surface.setAttribute('animation__glow',
                'property: material.opacity; to: 0.25; dir: alternate; loop: true; dur: 4000');

            // Agregar grid holográfico
            Utils.createHolographicGrid(surface);

            // Agregar marcadores de esquina
            Utils.createCornerMarkers(surface);

            // Agregar a contenedor y registrar
            const surfacesContainer = document.getElementById('surfaces-container');
            if (surfacesContainer) {
                surfacesContainer.appendChild(surface);
                this.detectedSurfaces.push(surface);
                
                // Actualizar variables globales de forma más robusta
                if (typeof window !== 'undefined') {
                    window.currentSurface = surface;
                    window.surfaceDetected = true;
                    window.surfaces = this.detectedSurfaces;
                    
                    // Verificar que las variables se actualizaron correctamente
                    console.log('🔍 Variables globales actualizadas:', {
                        surfaceDetected: window.surfaceDetected,
                        currentSurface: window.currentSurface ? 'existe' : 'no existe',
                        surfacesCount: window.surfaces.length
                    });
                }
                
                console.log(`🎯 Superficie ${this.detectedSurfaces.length} creada exitosamente`);
            } else {
                console.error('❌ Contenedor de superficies no encontrado');
            }

            // Actualizar interfaz
            this.updateUIAfterSurfaceCreation();

            // Sincronizar variables globales con main.js
            if (typeof window.syncGlobalVariables === 'function') {
                window.syncGlobalVariables();
                console.log('🔄 Variables globales sincronizadas desde AR system');
            }

            // Efectos de retroalimentación
            Utils.vibrate([100, 50, 100]);

            // Notificación de éxito
            alertify.success('✅ Superficie AR detectada', 3);

        } catch (error) {
            console.error('❌ Error al crear superficie:', error);
            this.isScanning = false;
            Swal.fire({
                icon: 'error',
                title: 'Error de Superficie',
                text: 'No se pudo crear la superficie AR. Intenta escanear de nuevo.',
                background: '#1e1e1e',
                color: '#ffffff'
            });
        }
    },

    // Actualizar UI después de crear superficie
    updateUIAfterSurfaceCreation: function() {
        try {
            const statusElement = document.getElementById('surface-status');
            const deployBtn = document.getElementById('deploy-btn');
            const surfaceCountElement = document.getElementById('surface-count');

            if (statusElement) {
                statusElement.innerHTML =
                    '✅ <span class="surface-detected">Superficie HomeLab detectada y lista</span>';
            }

            if (deployBtn) {
                deployBtn.disabled = false;
                console.log('🚀 Botón de despliegue habilitado');
            }

            if (surfaceCountElement) {
                surfaceCountElement.textContent =
                    Utils.formatSurfaceCount(this.detectedSurfaces.length);
            }

            // Actualizar estadísticas rápidas si el menú está contraído
            if (typeof updateQuickStats === 'function') {
                updateQuickStats();
            }
        } catch (error) {
            console.error('❌ Error al actualizar UI:', error);
        }
    },

    // Crear elemento desplegado en superficie
    createDeployedItem: function(category, surface) {
        try {
            const item = Utils.getRandomItem(category);
            const config = Utils.getCategoryConfig(category);
            
            if (!item || !config) {
                console.error('❌ Configuración de categoría no válida:', category);
                return null;
            }
            
            const surfacePos = surface.getAttribute('position');
            const itemPosition = Utils.getRandomSurfacePosition(surfacePos);

            console.log(`🚀 Desplegando ${item.name} en posición:`, itemPosition);

            // Crear elemento principal
            const element = document.createElement('a-entity');
            element.setAttribute('position',
                `${itemPosition.x} ${itemPosition.y} ${itemPosition.z}`);
            element.setAttribute('class', 'homelab-item interactive');
            element.setAttribute('mixin', config.mixin);
            element.setAttribute('color', item.color);

            // Animaciones de aparición
            element.setAttribute('animation__spawn',
                'property: scale; from: 0.1 0.1 0.1; to: 1 1 1; dur: 800; easing: easeOutBack');
            element.setAttribute('animation__rotate',
                `property: rotation; to: 0 360 0; loop: true; dur: ${config.rotationSpeed + Math.random() * 8000}`);

            // Agregar animación de flotación para mascotas
            if (config.hasFloat) {
                element.setAttribute('animation__float',
                    `property: position; to: ${itemPosition.x} ${itemPosition.y + 0.1} ${itemPosition.z}; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine`);
            }

            // Crear componentes del elemento
            this.addItemComponents(element, item, config);

            // Agregar a escena y registrar
            const homelabContainer = document.getElementById('homelab-container');
            if (homelabContainer) {
                homelabContainer.appendChild(element);
                this.deployedItems.push({ element, category, item });
                console.log(`✅ ${item.name} desplegado exitosamente`);
            }

            return element;
        } catch (error) {
            console.error('❌ Error al crear elemento desplegado:', error);
            return null;
        }
    },

    // Agregar componentes visuales al elemento
    addItemComponents: function(element, item, config) {
        try {
            // Etiqueta principal
            const label = Utils.createHolographicText(
                `${item.emoji} ${item.name}`,
                `0 ${config.heightOffset + 0.2} 0`
            );

            // Descripción
            const desc = Utils.createHolographicText(
                item.description,
                `0 ${config.heightOffset + 0.05} 0`,
                '1.2 1.2 1.2',
                '#ffffff'
            );

            // Sombra
            const shadow = Utils.createShadow();

            // Luz
            const light = Utils.createPointLight(item.color);

            // Sistema de partículas
            const particles = this.createParticleSystem(item.color, config.mixin.replace('-base', ''));

            // Agregar todos los componentes
            element.appendChild(label);
            element.appendChild(desc);
            element.appendChild(shadow);
            element.appendChild(light);
            element.appendChild(particles);
            
            console.log(`🔧 Componentes agregados a ${item.name}`);
        } catch (error) {
            console.error('❌ Error al agregar componentes:', error);
        }
    },

    // Crear sistema de partículas
    createParticleSystem: function(color, category) {
        try {
            const particles = document.createElement('a-entity');
            particles.setAttribute('position', '0 0.1 0');

            const effect = particleEffects[category] || particleEffects.services;

            particles.setAttribute('particle-system', `
                preset: ${effect.preset}; 
                color: ${color}; 
                particleCount: ${effect.particleCount}; 
                maxAge: ${effect.maxAge}; 
                size: ${effect.size};
                accelerationValue: ${effect.accelerationValue}
            `);

            return particles;
        } catch (error) {
            console.error('❌ Error al crear sistema de partículas:', error);
            // Retornar elemento vacío como fallback
            return document.createElement('a-entity');
        }
    },

    // Limpiar laboratorio completo
    clearLaboratory: function() {
        try {
            console.log('🧹 Iniciando limpieza del laboratorio...');
            
            // Limpiar elementos desplegados
            Utils.clearDeployedItems();
            this.deployedItems = [];

            // Limpiar superficies (mantener la última si existe)
            const surfacesContainer = document.getElementById('surfaces-container');
            if (surfacesContainer && surfacesContainer.children.length > 1) {
                // Remover todas excepto la última
                while (surfacesContainer.children.length > 1) {
                    surfacesContainer.removeChild(surfacesContainer.firstChild);
                }
                this.detectedSurfaces = this.detectedSurfaces.slice(-1);
            }

            // Resetear contadores globales
            if (typeof window !== 'undefined') {
                window.itemCount = 0;
                window.surfaces = this.detectedSurfaces;
            }

            // Actualizar UI
            const itemCountElement = document.getElementById('item-count');
            if (itemCountElement) {
                itemCountElement.textContent = Utils.formatItemCount(0);
            }

            // Efecto visual
            Utils.vibrate([50, 100, 50]);

            console.log('✅ Laboratorio HomeLab reiniciado exitosamente');
        } catch (error) {
            console.error('❌ Error al limpiar laboratorio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Limpieza',
                text: 'No se pudo reiniciar el laboratorio por completo.',
                background: '#1e1e1e',
                color: '#ffffff'
            });
        }
    },

    // Crear página interactiva en 3D
    createInteractivePage: function(pageData, position) {
        try {
            console.log('📄 Creando página interactiva:', pageData.name);
            
            const page = document.createElement('a-entity');
            page.setAttribute('position', position);
            page.setAttribute('class', 'homelab-item interactive');
            
            // Marco de la página
            const frame = document.createElement('a-box');
            frame.setAttribute('width', '1.7');
            frame.setAttribute('height', '1.0');
            frame.setAttribute('depth', '0.1');
            frame.setAttribute('color', '#333333');
            frame.setAttribute('position', '0 0 -0.05');
            
            // Superficie de la página
            const surface = document.createElement('a-entity');
            surface.setAttribute('mixin', 'page-base');
            surface.setAttribute('position', '0 0 0');
            
            // Agregar contenido de la página como textura
            this.createPageContent(surface, pageData);
            
            // Etiqueta de la página
            const label = Utils.createHolographicText(
                `${pageData.emoji} ${pageData.name}`,
                '0 0.6 0',
                '1.5 1.5 1.5',
                '#ffffff'
            );
            
            // Sombra
            const shadow = Utils.createShadow(0.8);
            
            page.appendChild(frame);
            page.appendChild(surface);
            page.appendChild(label);
            page.appendChild(shadow);
            
            // Agregar evento de interacción
            page.setAttribute('page-interaction', `url: ${pageData.url}`);
            
            const homelabContainer = document.getElementById('homelab-container');
            if (homelabContainer) {
                homelabContainer.appendChild(page);
                this.deployedItems.push({ element: page, category: 'pages', item: pageData });
                console.log(`✅ Página ${pageData.name} creada exitosamente`);
            }
            
            return page;
        } catch (error) {
            console.error('❌ Error al crear página interactiva:', error);
            return null;
        }
    },
    
    // Crear contenido de página
    createPageContent: function(surface, pageData) {
        try {
            // Crear placeholder con información de la página
            const placeholder = document.createElement('a-entity');
            placeholder.setAttribute('geometry', 'primitive: plane; width: 1.5; height: 0.8');
            placeholder.setAttribute('material', 'color: #1a1a1a');
            placeholder.setAttribute('position', '0 0 0.01');
            
            // Título de la página
            const title = document.createElement('a-text');
            title.setAttribute('value', pageData.name);
            title.setAttribute('align', 'center');
            title.setAttribute('color', '#00ff88');
            title.setAttribute('position', '0 0.2 0.02');
            title.setAttribute('width', '1.4');
            
            // Descripción
            const desc = document.createElement('a-text');
            desc.setAttribute('value', pageData.description);
            desc.setAttribute('align', 'center');
            desc.setAttribute('color', '#cccccc');
            desc.setAttribute('position', '0 -0.1 0.02');
            desc.setAttribute('width', '1.4');
            
            // Icono
            const icon = document.createElement('a-entity');
            icon.setAttribute('geometry', 'primitive: circle; radius: 0.15');
            icon.setAttribute('material', `color: ${pageData.color}`);
            icon.setAttribute('position', '0 -0.3 0.02');
            
            placeholder.appendChild(title);
            placeholder.appendChild(desc);
            placeholder.appendChild(icon);
            surface.appendChild(placeholder);
        } catch (error) {
            console.error('❌ Error al crear contenido de página:', error);
        }
    },
});

// Componente para interacción con páginas
AFRAME.registerComponent('page-interaction', {
    schema: {
        url: { type: 'string', default: '' }
    },
    
    init: function() {
        this.el.setAttribute('class', 'interactive-page');
        this.setupInteraction();
    },
    
    setupInteraction: function() {
        const el = this.el;
        const data = this.data;
        
        // Evento de clic mejorado
        el.addEventListener('click', function() {
            if (data.url) {
                try {
                    console.log('🔗 Abriendo página:', data.url);
                    // Intentar abrir en nueva pestaña
                    const newWindow = window.open(data.url, '_blank');
                    if (!newWindow) {
                        // Si el popup blocker lo bloquea, mostrar mensaje
                        console.warn('⚠️ Popup bloqueado, intentando redirección');
                        window.location.href = data.url;
                    }
                } catch (error) {
                    console.error('❌ Error al abrir página:', error);
                    // Fallback: redirección en la misma ventana
                    window.location.href = data.url;
                }
            }
        });
        
        // Efecto de hover
        el.setAttribute('event-set__mouseenter', {
            '_event': 'mouseenter',
            'scale': '1.05 1.05 1.05'
        });
        el.setAttribute('event-set__mouseleave', {
            '_event': 'mouseleave',
            'scale': '1 1 1'
        });
    }
});