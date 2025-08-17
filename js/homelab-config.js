// Configuración de rendimiento y parámetros del sistema HomeLab AR

const HomeLabConfig = {
    // Configuración de rendimiento
    performance: {
        // Monitoreo de FPS
        enableFPSMonitoring: true,
        fpsLogInterval: 100, // Log cada 100 frames
        
        // Optimizaciones de renderizado
        maxParticleCount: 50,
        maxLights: 8,
        shadowQuality: 'medium', // low, medium, high
        
        // Límites de elementos
        maxDeployedItems: 20,
        maxSurfaces: 5,
        
        // Configuración de LOD (Level of Detail)
        lodDistances: {
            near: 2,
            medium: 5,
            far: 10
        }
    },

    // Configuración de AR
    ar: {
        // Detección de superficie
        surfaceDetectionTimeout: 10000, // 10 segundos
        surfaceScanInterval: 120, // ms entre actualizaciones de progreso
        
        // Configuración de WebXR
        webxr: {
            enableHitTest: true,
            hitTestTimeout: 5000,
            referenceSpace: 'local'
        },
        
        // Configuración de cámara
        camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 1.6, z: 0 }
        }
    },

    // Configuración de UI
    ui: {
        // Animaciones
        animationDuration: {
            menu: 300,
            surface: 1500,
            item: 800,
            notification: 3000
        },
        
        // Colores del tema
        colors: {
            primary: '#00ff88',
            secondary: '#008866',
            accent: '#ffaa00',
            error: '#ff4444',
            success: '#00ff88',
            warning: '#ffaa00',
            info: '#0088ff'
        },
        
        // Configuración de notificaciones
        notifications: {
            position: 'top-right',
            duration: 3000,
            maxVisible: 3
        }
    },

    // Configuración de efectos
    effects: {
        // Partículas
        particles: {
            enabled: true,
            maxCount: 100,
            defaultPreset: 'snow'
        },
        
        // Sonidos
        audio: {
            enabled: true,
            volume: 0.5,
            enableVibration: true
        },
        
        // Iluminación
        lighting: {
            ambient: true,
            directional: true,
            point: true,
            shadows: true
        }
    },

    // Configuración de debug
    debug: {
        enabled: false,
        logLevel: 'info', // error, warn, info, debug
        showPerformance: true,
        showBoundingBoxes: false,
        showWireframes: false
    },

    // Configuración de dispositivos
    devices: {
        // Configuración específica por dispositivo
        mobile: {
            maxParticleCount: 30,
            shadowQuality: 'low',
            enableComplexAnimations: false
        },
        
        desktop: {
            maxParticleCount: 100,
            shadowQuality: 'high',
            enableComplexAnimations: true
        },
        
        vr: {
            maxParticleCount: 50,
            shadowQuality: 'medium',
            enableComplexAnimations: true
        }
    },

    // Métodos de utilidad
    utils: {
        // Obtener configuración según el dispositivo
        getDeviceConfig() {
            const userAgent = navigator.userAgent.toLowerCase();
            
            if (/mobile|android|iphone|ipad/.test(userAgent)) {
                return HomeLabConfig.devices.mobile;
            } else if (/vr|webxr/.test(userAgent)) {
                return HomeLabConfig.devices.vr;
            } else {
                return HomeLabConfig.devices.desktop;
            }
        },

        // Obtener configuración de rendimiento optimizada
        getOptimizedPerformanceConfig() {
            const deviceConfig = this.getDeviceConfig();
            
            return {
                maxParticleCount: Math.min(
                    HomeLabConfig.performance.maxParticleCount,
                    deviceConfig.maxParticleCount
                ),
                shadowQuality: deviceConfig.shadowQuality,
                enableComplexAnimations: deviceConfig.enableComplexAnimations
            };
        },

        // Validar configuración
        validateConfig() {
            const errors = [];
            
            if (HomeLabConfig.performance.maxDeployedItems < 1) {
                errors.push('maxDeployedItems debe ser mayor a 0');
            }
            
            if (HomeLabConfig.ar.surfaceDetectionTimeout < 1000) {
                errors.push('surfaceDetectionTimeout debe ser al menos 1000ms');
            }
            
            if (HomeLabConfig.ui.animationDuration.menu < 100) {
                errors.push('Duración de animación del menú debe ser al menos 100ms');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },

        // Aplicar configuración al sistema
        applyConfig() {
            const validation = this.validateConfig();
            
            if (!validation.isValid) {
                console.error('❌ Configuración inválida:', validation.errors);
                return false;
            }
            
            // Aplicar configuraciones al sistema
            this.applyPerformanceConfig();
            this.applyUIConfig();
            this.applyEffectsConfig();
            
            console.log('✅ Configuración aplicada exitosamente');
            return true;
        },

        // Aplicar configuración de rendimiento
        applyPerformanceConfig() {
            const optimizedConfig = this.getOptimizedPerformanceConfig();
            
            // Aplicar límites de partículas
            if (window.particleEffects) {
                Object.keys(window.particleEffects).forEach(category => {
                    const effect = window.particleEffects[category];
                    effect.particleCount = Math.min(effect.particleCount, optimizedConfig.maxParticleCount);
                });
            }
            
            console.log('📊 Configuración de rendimiento aplicada:', optimizedConfig);
        },

        // Aplicar configuración de UI
        applyUIConfig() {
            // Aplicar colores del tema
            const root = document.documentElement;
            Object.entries(HomeLabConfig.ui.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
            
            console.log('🎨 Configuración de UI aplicada');
        },

        // Aplicar configuración de efectos
        applyEffectsConfig() {
            // Configurar efectos según la configuración
            if (!HomeLabConfig.effects.particles.enabled) {
                console.log('🔇 Sistema de partículas deshabilitado');
            }
            
            if (!HomeLabConfig.effects.audio.enabled) {
                console.log('🔇 Audio deshabilitado');
            }
            
            console.log('✨ Configuración de efectos aplicada');
        }
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.HomeLabConfig = HomeLabConfig;
    
    // Aplicar configuración automáticamente con contexto correcto
    window.addEventListener('load', () => {
        HomeLabConfig.utils.applyConfig.call(HomeLabConfig.utils);
    });
}

// Configuración de desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    HomeLabConfig.debug.enabled = true;
    HomeLabConfig.debug.logLevel = 'debug';
    console.log('🔧 Modo desarrollo activado');
}
