// Definición de elementos del HomeLab
const homelabItems = {
    services: [
        { name: "Homer Dashboard", color: "#FF6B35", emoji: "🏠", description: "Panel principal" },
        { name: "Dashy", color: "#00A8E8", emoji: "📊", description: "Dashboard moderno" },
        { name: "Heimdall", color: "#FF8500", emoji: "🛡️", description: "Portal de servicios" },
        { name: "Portainer", color: "#13BEF9", emoji: "🐳", description: "Gestión Docker" },
        { name: "Nextcloud", color: "#0082C9", emoji: "☁️", description: "Nube personal" },
        { name: "Plex", color: "#E5A00D", emoji: "🎬", description: "Media server" },
        { name: "Pi-hole", color: "#96060C", emoji: "🕳️", description: "DNS blocker" },
        { name: "Grafana", color: "#F46800", emoji: "📈", description: "Monitoreo" },
        { name: "Home Assistant", color: "#41BDF5", emoji: "🏡", description: "Domótica" },
        { name: "Jellyfin", color: "#00A4DC", emoji: "🍿", description: "Media libre" },
        { name: "Nginx", color: "#009639", emoji: "🌐", description: "Reverse proxy" },
        { name: "Traefik", color: "#24A1C1", emoji: "🔀", description: "Router dinámico" }
    ],
    pets: [
        { name: "Servidor Gato", color: "#FF69B4", emoji: "🐱", description: "Mascota servidora" },
        { name: "Docker Perro", color: "#87CEEB", emoji: "🐕", description: "Contenedor fiel" },
        { name: "Script Hamster", color: "#FFD700", emoji: "🐹", description: "Ejecutor rápido" },
        { name: "Cache Pez", color: "#00CED1", emoji: "🐠", description: "Memoria rápida" },
        { name: "Bot Pingüino", color: "#191970", emoji: "🐧", description: "Linux bot" },
        { name: "DB Tortuga", color: "#228B22", emoji: "🐢", description: "Base persistente" },
        { name: "API Colibrí", color: "#FF1493", emoji: "🐦", description: "REST veloz" },
        { name: "Log Búho", color: "#8B4513", emoji: "🦉", description: "Observador nocturno" }
    ],
    games: [
        { name: "Terminal Snake", color: "#00FF00", emoji: "🐍", description: "Serpiente retro" },
        { name: "Code Tetris", color: "#FF1493", emoji: "🧱", description: "Bloques de código" },
        { name: "Network Pong", color: "#00FFFF", emoji: "🏓", description: "Ping pong" },
        { name: "Pixel Invaders", color: "#FF4500", emoji: "👾", description: "Invasores pixel" },
        { name: "Sudo Mario", color: "#FF0000", emoji: "🍄", description: "Plomero admin" },
        { name: "Git Maze", color: "#800080", emoji: "🌀", description: "Laberinto versionado" },
        { name: "Binary Chess", color: "#FFD700", emoji: "♟️", description: "Ajedrez binario" },
        { name: "Regex Race", color: "#FF6347", emoji: "🏁", description: "Carrera de patrones" }
    ],
    tools: [
        { name: "SSH Terminal", color: "#32CD32", emoji: "⌨️", description: "Consola remota" },
        { name: "Log Viewer", color: "#FF6347", emoji: "📋", description: "Visor de logs" },
        { name: "CPU Monitor", color: "#1E90FF", emoji: "📊", description: "Monitor sistema" },
        { name: "Network Scanner", color: "#FFD700", emoji: "📡", description: "Escáner red" },
        { name: "Backup Tool", color: "#9370DB", emoji: "💾", description: "Herramienta backup" },
        { name: "Code Editor", color: "#FF69B4", emoji: "📝", description: "Editor código" },
        { name: "Docker Compose", color: "#0db7ed", emoji: "🐋", description: "Orquestador" },
        { name: "Prometheus", color: "#E6522C", emoji: "🔥", description: "Métricas avanzadas" }
    ],
    pages: [
        { 
            name: "Dashboard", 
            color: "#4A90E2", 
            emoji: "📊", 
            description: "Panel de control principal",
            url: "../pages/dashboard.html"
        },
        { 
            name: "Configuración", 
            color: "#50E3C2", 
            emoji: "⚙️", 
            description: "Ajustes del sistema",
            url: "../pages/settings.html"
        },
        { 
            name: "Estadísticas", 
            color: "#F5A623", 
            emoji: "📈", 
            description: "Datos y métricas",
            url: "../pages/stats.html"
        }
    ]
};

// Configuración de categorías
const categoryConfig = {
    services: {
        name: 'Servicios',
        mixin: 'service-base',
        heightOffset: 0.15,
        rotationSpeed: 10000
    },
    pets: {
        name: 'Mascotas',
        mixin: 'pet-base',
        heightOffset: 0.15,
        rotationSpeed: 8000,
        hasFloat: true
    },
    games: {
        name: 'Juegos',
        mixin: 'game-base',
        heightOffset: 0.05,
        rotationSpeed: 12000
    },
    tools: {
        name: 'Herramientas',
        mixin: 'tool-base',
        heightOffset: 0.2,
        rotationSpeed: 15000
    },
    pages: {
        name: 'Páginas',
        mixin: 'page-base',
        heightOffset: 0,
        rotationSpeed: 0
    }
};

// Efectos de partículas por categoría
const particleEffects = {
    services: {
        preset: 'snow',
        particleCount: 30,
        maxAge: 3,
        size: 0.8,
        accelerationValue: '0 -0.1 0'
    },
    pets: {
        preset: 'dust',
        particleCount: 20,
        maxAge: 4,
        size: 1.2,
        accelerationValue: '0 0.05 0'
    },
    games: {
        preset: 'default',
        particleCount: 40,
        maxAge: 2,
        size: 0.6,
        accelerationValue: '0 0 0'
    },
    tools: {
        preset: 'snow',
        particleCount: 25,
        maxAge: 3.5,
        size: 1.0,
        accelerationValue: '0 -0.05 0'
    },
    pages: {
        preset: 'default',
        particleCount: 20,
        maxAge: 2,
        size: 0.5,
        accelerationValue: '0 0 0'
    }
};

// Páginas disponibles para mostrar
const availablePages = [
    {
        id: 'dashboard',
        title: '🏠 Panel Principal',
        description: 'Dashboard del HomeLab',
        file: 'dashboard.html'
    },
    {
        id: 'settings',
        title: '⚙️ Configuración',
        description: 'Ajustes del sistema',
        file: 'settings.html'
    },
    {
        id: 'stats',
        title: '📈 Estadísticas',
        description: 'Métricas y datos',
        file: 'stats.html'
    },
    {
        id: 'logs',
        title: '📝 Registros',
        description: 'Logs del sistema',
        file: 'logs.html'
    }
];