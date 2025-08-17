// js/audio-manager.js

const AudioManager = {
    sounds: {},
    isMuted: false,

    /**
     * Inicializa el gestor de audio, cargando los elementos de sonido desde el DOM.
     */
    init() {
        this.sounds = {
            'interface': document.getElementById('sfx-deploy-interface'),
            'object': document.getElementById('sfx-deploy-object'),
            'delete': document.getElementById('sfx-delete'),
            'reset': document.getElementById('sfx-reset')
        };
        console.log('🔊 Audio Manager inicializado');
    },

    /**
     * Reproduce un sonido por su ID.
     * @param {string} soundId El ID del sonido a reproducir ('interface', 'object', 'delete', 'reset').
     */
    playSound(soundId) {
        if (this.isMuted || !this.sounds[soundId]) {
            return;
        }

        const sound = this.sounds[soundId];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                if (error.name !== 'NotAllowedError') {
                    console.error(`🔊 Error al reproducir el sonido '${soundId}':`, error);
                }
            });
        }
    },

    /**
     * Alterna el estado de silencio.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        console.log(this.isMuted ? '🔇 Audio silenciado' : '🔊 Audio activado');
        // Aquí se podría actualizar un botón en la UI para reflejar el estado.
    }
};

// Inicializar el gestor cuando el DOM esté listo.
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});
