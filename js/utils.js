// Utilidades del sistema HomeLab AR

class Utils {
    // Generar vibración táctil si está disponible
    static vibrate(pattern = [100]) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    // Generar posición aleatoria en superficie
    static getRandomSurfacePosition(surfacePos, radius = 2.5) {
        const offsetX = (Math.random() - 0.5) * radius;
        const offsetZ = (Math.random() - 0.5) * radius;

        return {
            x: surfacePos.x + offsetX,
            y: surfacePos.y + 0.15,
            z: surfacePos.z + offsetZ
        };
    }

    // Crear efecto de despliegue visual
    static showDeploymentEffect(position, color) {
        const effect = document.createElement('div');
        effect.className = 'deployment-effect';
        effect.style.background = `radial-gradient(circle, ${color}44 0%, transparent 70%)`;
        effect.style.width = '200px';
        effect.style.height = '200px';
        effect.style.borderRadius = '50%';

        document.body.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1500);
    }

    // Aplicar efecto glitch a elemento
    static applyGlitchEffect(element, duration = 300) {
        if (!element) return;
        
        element.classList.add('glitch');
        setTimeout(() => {
            element.classList.remove('glitch');
        }, duration);
    }

    // Obtener configuración de categoría
    static getCategoryConfig(category) {
        if (typeof categoryConfig !== 'undefined') {
            return categoryConfig[category] || categoryConfig.services;
        }
        return null;
    }

    // Obtener elemento aleatorio de categoría
    static getRandomItem(category) {
        if (typeof homelabItems !== 'undefined') {
            const items = homelabItems[category] || homelabItems.services;
            return items[Math.floor(Math.random() * items.length)];
        }
        return null;
    }

    // Formatear contador de elementos
    static formatItemCount(count) {
        if (count === 0) return '0 elementos desplegados';
        if (count === 1) return '1 elemento desplegado';
        return `${count} elementos desplegados`;
    }

    // Formatear contador de superficies
    static formatSurfaceCount(count) {
        if (count === 0) return '0 superficies';
        if (count === 1) return '1 superficie';
        return `${count} superficies`;
    }

    // Crear marcadores de esquina para superficie
    static createCornerMarkers(surface) {
        for (let i = 0; i < 4; i++) {
            const corner = document.createElement('a-entity');
            const x = i % 2 === 0 ? -1.4 : 1.4;
            const z = i < 2 ? -1.4 : 1.4;

            corner.setAttribute('geometry', 'primitive: cylinder; radius: 0.05; height: 0.1');
            corner.setAttribute('position', `${x} 0.05 ${z}`);
            corner.setAttribute('material', 'color: #00ff88; emissive: #003322');
            corner.setAttribute('animation',
                `property: rotation; to: 0 360 0; loop: true; dur: ${3000 + i * 500}`);
            corner.setAttribute('light', 'type: point; color: #00ff88; intensity: 0.5; distance: 1');

            surface.appendChild(corner);
        }
    }

    // Crear grid holográfico para superficie
    static createHolographicGrid(surface) {
        const grid = document.createElement('a-entity');
        grid.setAttribute('geometry', 'primitive: plane; width: 3; height: 3');
        grid.setAttribute('material', `
            color: #00ff88; 
            opacity: 0.3; 
            transparent: true;
            shader: flat;
        `);
        grid.setAttribute('position', '0 0.001 0');
        surface.appendChild(grid);
    }

    // Calcular posición de superficie frente a cámara
    static calculateSurfacePosition(camera, distance = 2.5) {
        if (!camera) {
            return { x: 0, y: -1.3, z: -2.5 };
        }

        const cameraPos = camera.getAttribute('position');
        const cameraRot = camera.getAttribute('rotation');

        if (!cameraPos || !cameraRot) {
            return { x: 0, y: -1.3, z: -2.5 };
        }

        return {
            x: cameraPos.x + Math.sin(cameraRot.y * Math.PI / 180) * distance,
            y: cameraPos.y - 1.3,
            z: cameraPos.z - Math.cos(cameraRot.y * Math.PI / 180) * distance
        };
    }

    // Crear elemento de texto holográfico
    static createHolographicText(text, position, scale, color = '#00ff88') {
        const textEntity = document.createElement('a-text');
        textEntity.setAttribute('value', text);
        textEntity.setAttribute('position', position);
        textEntity.setAttribute('scale', scale);
        textEntity.setAttribute('color', color);
        textEntity.setAttribute('align', 'center');
        textEntity.setAttribute('font', 'roboto');
        return textEntity;
    }

    // Crear sombra para elemento
    static createShadow(scale = 1) {
        const shadow = document.createElement('a-entity');
        shadow.setAttribute('geometry', 'primitive: circle; radius: 0.25');
        shadow.setAttribute('material', 'color: #000000; opacity: 0.3');
        shadow.setAttribute('position', '0 -0.25 0');
        shadow.setAttribute('scale', `${scale} ${scale} ${scale}`);
        shadow.setAttribute('rotation', '-90 0 0');
        return shadow;
    }

    // Crear luz de punto para elemento
    static createPointLight(color, intensity = 0.7, distance = 2) {
        const light = document.createElement('a-light');
        light.setAttribute('type', 'point');
        light.setAttribute('color', color);
        light.setAttribute('intensity', intensity.toString());
        light.setAttribute('distance', distance.toString());
        return light;
    }

    // Limpiar elementos desplegados
    static clearDeployedItems() {
        const container = document.getElementById('homelab-container');
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            
            // Actualizar contador global
            if (typeof window !== 'undefined') {
                window.itemCount = 0;
            }
        }
    }

    // Limpiar superficies detectadas
    static clearDetectedSurfaces() {
        const container = document.getElementById('surfaces-container');
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            
            // Actualizar contador global
            if (typeof window !== 'undefined') {
                window.surfaces = [];
                window.surfaceDetected = false;
                window.currentSurface = null;
            }
        }
    }

    // Validar si un elemento existe en el DOM
    static elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Crear notificación temporal
    static showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'homelab-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00ff88;
            color: #000;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Roboto', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,255,136,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animar salida y remover
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Generar ID único
    static generateUniqueId() {
        return 'homelab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Verificar si el dispositivo soporta características específicas
    static checkDeviceCapabilities() {
        return {
            webxr: !!navigator.xr,
            vibration: !!navigator.vibrate,
            touch: 'ontouchstart' in window,
            mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}