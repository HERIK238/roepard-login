// ========================================
// COMPONENTES A-FRAME PERSONALIZADOS
// ========================================

// Componente para activación por mirada
AFRAME.registerComponent('gaze-activator', {
    schema: {
        onActivate: { type: 'string' }
    },
    init: function () {
        const el = this.el;
        let gazeTimer;
        let isHovered = false;

        el.addEventListener('mouseenter', () => {
            isHovered = true;
            el.setAttribute('material', 'color', '#00ff88');
            gazeTimer = setTimeout(() => {
                if (isHovered) {
                    const actionName = this.data.onActivate;
                    if (typeof window[actionName] === 'function') {
                        window[actionName]();
                    }
                }
            }, 3000);
        });

        el.addEventListener('mouseleave', () => {
            isHovered = false;
            el.setAttribute('material', 'color', '#008866');
            clearTimeout(gazeTimer);
        });
    }
});

// Componente para menú flotante 3D
AFRAME.registerComponent('floating-menu', {
    init: function () {
        const sceneEl = this.el;
        const buttons = [
            {
                label: 'Añadir Objeto',
                color: '#00ffaa',
                action: (event) => {
                    if (typeof deployItem === 'function') {
                        deployItem(event);
                    }
                }
            },
            {
                label: 'Quitar Objetos',
                color: '#ff4444',
                action: () => {
                    if (window.Utils?.clearDeployedItems) {
                        Utils.clearDeployedItems();
                    }
                }
            },
            {
                label: 'Quitar Superficies',
                color: '#ffaa00',
                action: () => {
                    if (window.Utils?.clearDetectedSurfaces) {
                        Utils.clearDetectedSurfaces();
                    }
                }
            }
        ];

        const radius = 2;
        const height = 1.5;

        buttons.forEach((btn, i) => {
            const angle = (i / buttons.length) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const button = document.createElement('a-entity');
            button.setAttribute('geometry', 'primitive: circle; radius: 0.25');
            button.setAttribute('material', `color: ${btn.color}; shader: flat;`);
            button.setAttribute('position', `${x} ${height} ${z}`);
            button.setAttribute('look-at', '[camera]');
            button.setAttribute('class', 'menu-button');

            // Texto encima del botón
            const label = document.createElement('a-text');
            label.setAttribute('value', btn.label);
            label.setAttribute('align', 'center');
            label.setAttribute('color', '#ffffff');
            label.setAttribute('position', '0 0.35 0');
            label.setAttribute('scale', '1 1 1');
            button.appendChild(label);

            // Cursor interactivo
            button.setAttribute('cursor', 'fuse: true; fuseTimeout: 3000');
            button.addEventListener('click', btn.action);

            sceneEl.appendChild(button);
        });

        // Ocultar el menú por defecto
        sceneEl.setAttribute('visible', false);
        
        console.log('🎛️ Menú 3D flotante inicializado (oculto por defecto)');
    }
});

// Componente para elementos interactivos del HomeLab
AFRAME.registerComponent('homelab-item', {
    init: function () {
        const el = this.el;
        
        // Agregar clase para estilos CSS
        el.classList.add('homelab-item');
        
        // Configurar interacciones básicas
        el.setAttribute('cursor', 'fuse: true; fuseTimeout: 2000');
        
        // Efecto de hover
        el.addEventListener('mouseenter', () => {
            el.setAttribute('scale', '1.05 1.05 1.05');
        });
        
        el.addEventListener('mouseleave', () => {
            el.setAttribute('scale', '1 1 1');
        });
        
        console.log('🏠 Elemento HomeLab inicializado');
    }
});

// Componente para superficies detectadas
AFRAME.registerComponent('detected-surface', {
    init: function () {
        const el = this.el;
        
        // Agregar clase para estilos CSS
        el.classList.add('detected-surface');
        
        // Configurar propiedades de superficie
        el.setAttribute('shadow', 'receive: true');
        
        console.log('🎯 Superficie detectada inicializada');
    }
});

// Componente para elementos de texto holográfico
AFRAME.registerComponent('holographic-text', {
    schema: {
        text: { type: 'string', default: '' },
        color: { type: 'color', default: '#00ff88' },
        size: { type: 'number', default: 1 }
    },
    
    init: function () {
        const el = this.el;
        const data = this.data;
        
        // Configurar texto holográfico
        el.setAttribute('text', {
            value: data.text,
            color: data.color,
            align: 'center',
            font: 'roboto',
            width: 2
        });
        
        // Agregar clase para estilos CSS
        el.classList.add('holographic-text');
        
        console.log('📝 Texto holográfico inicializado:', data.text);
    }
});

// Componente para efectos de partículas
AFRAME.registerComponent('particle-effect', {
    schema: {
        preset: { type: 'string', default: 'snow' },
        color: { type: 'color', default: '#00ff88' },
        count: { type: 'number', default: 30 }
    },
    
    init: function () {
        const el = this.el;
        const data = this.data;
        
        // Configurar sistema de partículas
        el.setAttribute('particle-system', {
            preset: data.preset,
            color: data.color,
            particleCount: data.count,
            maxAge: 3,
            size: 0.8
        });
        
        // Agregar clase para estilos CSS
        el.classList.add('particle-system');
        
        console.log('✨ Efecto de partículas inicializado:', data.preset);
    }
});

console.log('🎭 Componentes A-Frame personalizados cargados');
