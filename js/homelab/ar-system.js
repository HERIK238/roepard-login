// Sistema AR del HomeLab

// Registrar sistema principal del HomeLab
AFRAME.registerSystem('homelab', {
    init: function () {
        this.detectedSurfaces = [];
        this.deployedItems = [];
        this.cameraEl = document.querySelector('[camera]');
        this.isScanning = false;
        console.log('🏠 Sistema HomeLab AR inicializado');
    },

    // Simular detección de superficie con fases realistas
    async simulateSurfaceDetection() {
        if (this.isScanning) return false;

        this.isScanning = true;

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
                }

                // Actualizar UI con progreso
                document.getElementById('surface-status').innerHTML =
                    `🔄 <span style="color: #FFD700;">${phases[currentPhase]}... ${progress}%</span>`;

                // Completar cuando llega al 100%
                if (progress >= 100) {
                    clearInterval(interval);
                    this.createDetectedSurface();
                    this.isScanning = false;
                    resolve(true);
                }
            }, 120);
        });
    },

    // Crear superficie detectada con efectos holográficos
    createDetectedSurface() {
        const surfacePosition = Utils.calculateSurfacePosition(this.cameraEl);

        // Crear elemento principal de superficie
        const surface = document.createElement('a-entity');
        surface.setAttribute('id', `surface-${surfaces.length}`);
        surface.setAttribute('mixin', 'detected-surface');
        surface.setAttribute('position',
            `${surfacePosition.x} ${surfacePosition.y} ${surfacePosition.z}`);
        surface.setAttribute('rotation', '-90 0 0');
        surface.setAttribute('class', 'detected-surface');

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
        document.getElementById('surfaces-container').appendChild(surface);
        surfaces.push(surface);
        currentSurface = surface;
        surfaceDetected = true;

        // Actualizar interfaz
        this.updateUIAfterSurfaceCreation();

        // Efectos de retroalimentación
        Utils.vibrate([100, 50, 100]);

        console.log('🎯 Superficie HomeLab creada:', surfacePosition);
    },

    // Actualizar UI después de crear superficie
    updateUIAfterSurfaceCreation() {
        document.getElementById('surface-status').innerHTML =
            '✅ <span class="surface-detected">Superficie HomeLab detectada y lista</span>';
        document.getElementById('deploy-btn').disabled = false;
        document.getElementById('surface-count').textContent =
            Utils.formatSurfaceCount(surfaces.length);

        // Actualizar estadísticas rápidas si el menú está contraído
        if (typeof updateQuickStats === 'function') {
            updateQuickStats();
        }
    },

    // Crear elemento desplegado en superficie
    createDeployedItem(category, surface) {
        const item = Utils.getRandomItem(category);
        const config = Utils.getCategoryConfig(category);
        const surfacePos = surface.getAttribute('position');
        const itemPosition = Utils.getRandomSurfacePosition(surfacePos);

        // Crear elemento principal
        const element = document.createElement('a-entity');
        element.setAttribute('position',
            `${itemPosition.x} ${itemPosition.y} ${itemPosition.z}`);
        element.setAttribute('class', 'homelab-item');
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
        document.getElementById('homelab-container').appendChild(element);
        this.deployedItems.push({ element, category, item });

        return element;
    },

    // Agregar componentes visuales al elemento
    addItemComponents(element, item, config) {
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
    },

    // Crear sistema de partículas
    createParticleSystem(color, category) {
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
    },

    // Limpiar laboratorio completo
    clearLaboratory() {
        // Limpiar elementos desplegados
        Utils.clearDeployedItems();
        this.deployedItems = [];

        // Limpiar superficies (mantener la última si existe)
        const surfacesContainer = document.getElementById('surfaces-container');
        if (surfacesContainer.children.length > 1) {
            // Remover todas excepto la última
            while (surfacesContainer.children.length > 1) {
                surfacesContainer.removeChild(surfacesContainer.firstChild);
            }
            surfaces = surfaces.slice(-1);
        }

        // Resetear contadores
        itemCount = 0;

        // Actualizar UI
        document.getElementById('item-count').textContent =
            Utils.formatItemCount(itemCount);

        // Efecto visual
        Utils.vibrate([50, 100, 50]);

        console.log('🗑️ Laboratorio HomeLab reiniciado');
    }
});