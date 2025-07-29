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
        element.classList.add('glitch');
        setTimeout(() => {
            element.classList.remove('glitch');
        }, duration);
    }

    // Obtener configuración de categoría
    static getCategoryConfig(category) {
        return categoryConfig[category] || categoryConfig.services;
    }

    // Obtener elemento aleatorio de categoría
    static getRandomItem(category) {
        const items = homelabItems[category] || homelabItems.services;
        return items[Math.floor(Math.random() * items.length)];
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
        const cameraPos = camera.getAttribute('position');
        const cameraRot = camera.getAttribute('rotation');
        
        return {
            x: cameraPos.x + Math.sin(cameraRot.y * Math.PI / 180) * distance,
            y: cameraPos.y - 1.3,
            z: cameraPos.z - Math.cos(cameraRot.y * Math.PI / 180) * distance
        };
    }

    // Crear elemento de texto holográfico
    static createHolographicText(text, position, scale = '1.8 1.8 1.8', color = '#00ff88') {
        const textEl = document.createElement('a-text');
        textEl.setAttribute('value', text);
        textEl.setAttribute('position', position);
        textEl.setAttribute('align', 'center');
        textEl.setAttribute('color', color);
        textEl.setAttribute('scale', scale);
        textEl.setAttribute('billboard', '');
        textEl.setAttribute('material', 'shader: msdf; emissive: #003322');
        return textEl;
    }

    // Crear sombra para elemento
    static createShadow(radius = 0.3) {
        const shadow = document.createElement('a-circle');
        shadow.setAttribute('position', '0 -0.02 0');
        shadow.setAttribute('rotation', '-90 0 0');
        shadow.setAttribute('radius', radius.toString());
        shadow.setAttribute('color', '#000000');
        shadow.setAttribute('opacity', '0.4');
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
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    // Limpiar superficies detectadas
    static clearDetectedSurfaces() {
        const container = document.getElementById('surfaces-container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}