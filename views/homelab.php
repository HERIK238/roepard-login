<!DOCTYPE html>
<html>
  <head>
    <title>🏠 HomeLab AR - Tu Laboratorio Virtual</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- A-Frame y AR.js actualizados -->
    <script src="../dist/aframe/aframe.min.js"></script>
    <script src="../dist/aframe/aframe-ar.js"></script>

    <!-- Estilos -->
    <link rel="stylesheet" href="../css/homelab.css" />
    <!-- Icono -->
    <link rel="icon" href="../favicon.ico" type="image/x-icon" />
  </head>
  <body>


    <!-- Overlay inicial -->
    <div class="overlay" id="overlay">
      <div class="homelab-title">🏠 HomeLab AR</div>
      <div class="subtitle">Tu laboratorio de hogar en realidad aumentada</div>
      <p>Coloca servicios, mascotas y juegos en tu espacio real</p>
      <button class="control-btn start-btn" onclick="startAR()">
        🚀 Inicializar HomeLab AR
      </button>
      <div class="compatibility-info">
        Compatible con Android e iOS • Sin marcadores físicos
      </div>
    </div>

    <!-- Detector de superficie -->
    <div class="surface-detector hide" id="surface-detector">
      <div class="scanner-grid"></div>
      <div class="scanner-text">ESCANEANDO<br />SUPERFICIE</div>
      <button class="close-detector-btn" onclick="hideSurfaceDetector()">✕</button>
    </div>

    <!-- Agregar indicador de hora actual -->
    <div class="time-display" id="time-display">
        <span id="uam-date"></span>
    </div>


    <!-- Panel de controles -->
    <div class="controls hide" id="controls">
      <div class="controls-header">
        <div class="controls-title">🏠 HomeLab Control</div>
        <button class="minimize-btn" onclick="toggleMenu()">✕ Minimizar</button>
      </div>

      <div class="status-indicator" id="surface-status">
        🔍 Inicializando escáner de superficies...
      </div>

      <div class="category-selector">
        <button
          class="category-btn active"
          onclick="selectCategory('services')"
          id="cat-services"
        >
          🖥️ Servicios
        </button>
        <button
          class="category-btn"
          onclick="selectCategory('pets')"
          id="cat-pets"
        >
          🐾 Mascotas
        </button>
        <button
          class="category-btn"
          onclick="selectCategory('games')"
          id="cat-games"
        >
          🎮 Juegos
        </button>
        <button
          class="category-btn"
          onclick="selectCategory('tools')"
          id="cat-tools"
        >
          🔧 Herramientas
        </button>
        <button
          class="category-btn"
          onclick="selectCategory('pages')"
          id="cat-pages"
        >
          📄 Páginas
        </button>
      </div>

      <div class="main-controls">
        <button class="control-btn" onclick="detectSurface()" id="detect-btn">
          📡 Escanear Superficie
        </button>
        <button
          class="control-btn"
          onclick="deployItem()"
          id="deploy-btn"
          disabled
        >
          🚀 Desplegar Item
        </button>
        <button class="control-btn" onclick="clearLab()">
          🗑️ Reiniciar Lab
        </button>
      </div>

      <div class="info-panel">
        <span id="item-count">0 elementos desplegados</span>
        <span id="current-category">Categoría: Servicios</span>
        <span id="surface-count">0 superficies</span>
      </div>
    </div>

    <!-- Panel de páginas disponibles -->
    <div class="pages-panel hide" id="pages-panel">
      <div class="pages-header">📄 Páginas Disponibles</div>
      <div class="pages-list" id="pages-list">
        <!-- Las páginas se cargarán aquí dinámicamente -->
      </div>
    </div>

    <!-- Indicador de selección -->
    <div class="selection-indicator hide" id="selection-indicator">
      <div class="selection-dot"></div>
      <div class="selection-timer" id="selection-timer"></div>
    </div>

    <!-- Botón de menú flotante -->
    <button class="menu-toggle hide" id="menu-toggle" onclick="toggleMenu()">
      ⚙️
    </button>

    <!-- Indicador de menú -->
    <div class="menu-indicator" id="menu-indicator">
      Toca para abrir controles
    </div>

    <!-- Indicador lateral cuando menú está cerrado -->
    <div class="menu-closed-indicator" id="menu-closed-indicator">
      CONTROLES OCULTOS
    </div>

    <!-- Estadísticas rápidas -->
    <div class="quick-stats hide" id="quick-stats">
      <div id="quick-items">📦 0 elementos</div>
      <div id="quick-surfaces">🎯 0 superficies</div>
      <div id="quick-category">📂 Servicios</div>
    </div>

    <!-- Escena AR con WebXR -->
    <a-scene
      id="scene"
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
      vr-mode-ui="enabled: true"
      webxr="optionalFeatures: local-floor, hit-test; requiredFeatures: local;"
      homelab-system
    >
    <a-entity id="menu-button-add"
          geometry="primitive: circle; radius: 0.25"
          material="color: #008866; shader: flat"
          position="1 1.6 -2"
          gaze-activator="onActivate: deployItemAction">
</a-entity>

<a-text value="Añadir"
        position="1 1.9 -2"
        align="center"
        color="#00ff88"
        scale="1 1 1">
</a-text>

<a-entity id="menu-button-clear-items"
          geometry="primitive: circle; radius: 0.25"
          material="color: #008866; shader: flat"
          position="0 1.6 -2"
          gaze-activator="onActivate: clearItems">
</a-entity>

<a-text value="Quitar Objetos"
        position="0 1.9 -2"
        align="center"
        color="#00ff88"
        scale="1 1 1">
</a-text>

<a-entity id="menu-button-clear-surfaces"
          geometry="primitive: circle; radius: 0.25"
          material="color: #008866; shader: flat"
          position="-1 1.6 -2"
          gaze-activator="onActivate: clearSurfaces">
</a-entity>

<a-text value="Quitar Superficies"
        position="-1 1.9 -2"
        align="center"
        color="#00ff88"
        scale="1 1 1">
</a-text>

    <a-entity floating-menu></a-entity>

    <!-- Punto de mirada (mirilla) -->
<a-entity camera look-controls position="0 1.6 0">
  <a-entity 
    id="gaze-point" 
    cursor="fuse: true; fuseTimeout: 3000"
    geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02" 
    material="color: white; shader: flat" 
    position="0 0 -1">
  </a-entity>
</a-entity>


<!-- Contenedor de botones flotantes 3D -->
<a-entity id="gaze-menu" position="0 0 0"></a-entity>

      <!-- Assets -->
      <a-assets>
        <!-- Audio de fondo -->
        <audio id="background-music" src="../assets/sounds/background_sfx.mp3" preload="auto" loop></audio>
        
        <!-- Servicios HomeLab -->
        <a-mixin
          id="service-base"
          geometry="primitive: box; width: 0.3; height: 0.3; depth: 0.3"
          material="metalness: 0.8; roughness: 0.2; emissive: #000000"
          shadow="cast: true; receive: true"
        >
        </a-mixin>

        <!-- Mascotas -->
        <a-mixin
          id="pet-base"
          geometry="primitive: sphere; radius: 0.15"
          material="metalness: 0.1; roughness: 0.9; emissive: #000000"
          shadow="cast: true; receive: true"
        >
        </a-mixin>

        <!-- Juegos -->
        <a-mixin
          id="game-base"
          geometry="primitive: cylinder; radius: 0.2; height: 0.1"
          material="metalness: 0.5; roughness: 0.3; emissive: #000000"
          shadow="cast: true; receive: true"
        >
        </a-mixin>

        <!-- Herramientas -->
        <a-mixin
          id="tool-base"
          geometry="primitive: octahedron; radius: 0.2"
          material="metalness: 0.7; roughness: 0.4; emissive: #000000"
          shadow="cast: true; receive: true"
        >
        </a-mixin>

        <!-- Páginas -->
        <a-mixin
          id="page-base"
          geometry="primitive: plane; width: 1.6; height: 0.9"
          material="color: #ffffff; shader: flat"
          shadow="receive: true"
        >
        </a-mixin>

        <!-- Superficie detectada -->
        <a-mixin
          id="detected-surface"
          geometry="primitive: plane; width: 3; height: 3"
          material="color: #00ff88; opacity: 0.1; transparent: true; side: double"
          shadow="receive: true"
        >
        </a-mixin>
      </a-assets>

      <!-- Cámara con raycaster -->
      <a-entity
        id="cameraRig"
        camera
        look-controls
        wasd-controls-enabled="false"
        position="0 1.6 0"
        raycaster="objects: .surface-target, .interactive; far: 100; interval: 100"
      >
      </a-entity>

      <!-- Plano de detección invisible -->
      <a-plane
        id="detection-plane"
        position="0 -1 -4"
        rotation="-90 0 0"
        width="20"
        height="20"
        color="#ffffff"
        opacity="0"
        class="surface-target"
      >
      </a-plane>

      <!-- Contenedores -->
      <a-entity id="surfaces-container"></a-entity>
      <a-entity id="homelab-container"></a-entity>

      <!-- Iluminación ambiente tech -->
      <a-light type="ambient" color="#001122" intensity="0.3"></a-light>
      <a-light
        type="directional"
        position="3 6 3"
        color="#ffffff"
        intensity="0.8"
        shadow
      ></a-light>
      <a-light
        type="point"
        position="0 4 0"
        color="#00ff88"
        intensity="0.5"
        distance="10"
      ></a-light>
    </a-scene>
    <!-- Menú 3D de opciones flotantes (añadir, eliminar, limpiar) -->
<a-entity id="gaze-menu" position="0 1.6 0">

</a-entity>

    <!-- MomentJS -->
    <script src="../dist/moment/js/moment.js"></script>
    <script src="../dist/moment/js/moment-timezone-with-data.js"></script>

    <!-- Scripts -->
    <script src="../js/homelab-data.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/ar-system.js"></script>
    <script src="../js/main.js"></script>
<script>
  const menuOptions = [
    { label: 'Añadir', action: () => deployItem() },
    { label: 'Eliminar', action: () => Utils.clearDeployedItems() },
    { label: 'Limpiar', action: () => Utils.clearDetectedSurfaces() }
  ];

  const gazeMenu = document.getElementById('gaze-menu');
  const radius = 2;

  // Crear entidades físicas 3D flotantes
  menuOptions.forEach((opt, i) => {
    const angle = (i / menuOptions.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const container = document.createElement('a-entity');
    container.setAttribute('position', `${x} 0 ${z}`);
    container.setAttribute('look-at', '[camera]');
    container.setAttribute('class', 'gaze-button');
    container.setAttribute('data-index', i);

    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('radius', '0.3');
    sphere.setAttribute('color', '#00ff88');
    sphere.setAttribute('opacity', '0.8');
    sphere.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1.1; startEvents: hover-on; dur: 200');
    sphere.setAttribute('animation__leave', 'property: scale; to: 1 1 1; startEvents: hover-off; dur: 200');
    container.appendChild(sphere);

    const label = document.createElement('a-text');
    label.setAttribute('value', opt.label);
    label.setAttribute('align', 'center');
    label.setAttribute('color', '#222');
    label.setAttribute('position', '0 -0.5 0');
    label.setAttribute('width', '3');
    container.appendChild(label);

    gazeMenu.appendChild(container);
  });

  // Gaze detection (por mirilla central)
  let gazeTarget = null;
  let gazeStartTime = null;
  const RETICLE_DURATION = 3000;

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
      el.setAttribute('material', 'color', '#00ff88'); // Color al enfocar
      gazeTimer = setTimeout(() => {
        if (isHovered) {
          const actionName = this.data.onActivate;
          if (typeof window[actionName] === 'function') {
            window[actionName]();
          }
        }
      }, 3000); // Espera 3 segundos
    });

    el.addEventListener('mouseleave', () => {
      isHovered = false;
      el.setAttribute('material', 'color', '#008866'); // Color normal
      clearTimeout(gazeTimer);
    });
  }
});

// Acciones globales
window.deployItemAction = () => {
  if (typeof deployItem === 'function') {
    deployItem({ itemId: 'item1' });
  }
};

window.clearItems = () => {
  if (window.Utils?.clearDeployedItems) {
    Utils.clearDeployedItems();
  }
};

window.clearSurfaces = () => {
  if (window.Utils?.clearDetectedSurfaces) {
    Utils.clearDetectedSurfaces();
  }
};

  document.querySelector('[camera]')?.setAttribute('gaze-checker', '');
</script>
<script>
  window.addEventListener('load', () => {
    const gazeMenu = document.querySelector('#gaze-menu');
    const gazePoint = document.querySelector('#gaze-point');
    const camera = document.querySelector('[camera]');

    if (!gazeMenu || !gazePoint || !camera) return;

    // Botones flotantes con acciones reales

    // Generar esferas flotantes
    buttons.forEach((btn, index) => {
      const angle = (index / buttons.length) * Math.PI * 2;
      const radius = 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const entity = document.createElement('a-entity');
      entity.setAttribute('geometry', 'primitive: sphere; radius: 0.25');
      entity.setAttribute('material', 'color: #00ffaa; opacity: 0.7');
      entity.setAttribute('position', `${x} 1.6 ${z}`);
      entity.setAttribute('look-at', '[camera]');

      const text = document.createElement('a-text');
      text.setAttribute('value', btn.label);
      text.setAttribute('align', 'center');
      text.setAttribute('position', '0 0.4 0');
      text.setAttribute('color', '#ffffff');
      entity.appendChild(text);

      gazeMenu.appendChild(entity);

      // Lógica de activación por mirada
      let gazeTime = 0;
      const interval = setInterval(() => {
        const entityPos = entity.object3D.getWorldPosition(new THREE.Vector3());
        const gazePos = gazePoint.object3D.getWorldPosition(new THREE.Vector3());
        const distance = entityPos.distanceTo(gazePos);

        if (distance < 0.25) {
          gazeTime += 100;
          if (gazeTime >= 3000) {
            btn.action();
            entity.setAttribute('material', 'color: #ffaa00; opacity: 1');
            if (window.Utils?.vibrate) Utils.vibrate([100]);
            clearInterval(interval);
          }
        } else {
          gazeTime = 0;
        }
      }, 100);
    });
  });
</script>
<script>
  AFRAME.registerComponent('floating-menu', {
    init: function () {
      const sceneEl = this.el;
      const cameraEl = document.querySelector('[camera]');
      const buttons = [
        {
          label: 'Añadir Objeto',
          color: '#00ffaa',
          action: () => {
            if (typeof deployItem === 'function') {
              deployItem({ itemId: 'item1' });
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

      const radius = 2; // Distancia del usuario
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

        // Cursor interactivo (activación por mirar)
        button.setAttribute('cursor-listener', '');
        button.setAttribute('cursor', 'fuse: true; fuseTimeout: 3000');

        // Acción al seleccionar
        button.addEventListener('click', btn.action);

        sceneEl.appendChild(button);
      });
    }
  });

  // Componente para cambiar color al mirar
  AFRAME.registerComponent('cursor-listener', {
    init: function () {
      const el = this.el;
      const originalColor = el.getAttribute('material').color;

      el.addEventListener('mouseenter', () => {
        el.setAttribute('material', 'color', '#ffffff');
      });

      el.addEventListener('mouseleave', () => {
        el.setAttribute('material', 'color', originalColor);
      });
    }
  });
</script>


  </body>
</html>
