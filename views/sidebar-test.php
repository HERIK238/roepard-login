<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Sidebar Vanilla</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
        }

        :root {
            --primary-color: #64181c;
            --secondary-color: #efdbbf;
            --accent-color: #d3c1a8;
            --text-secondary: #79373a;
            --button-color: #d9b991;
            --background-gradient: linear-gradient(120deg, #64181c, #f5eada);
            --sidebar-width: 280px;
            --header-height: 70px;
        }

        body {
            background: var(--background-gradient);
            min-height: 100vh;
            color: var(--primary-color);
        }

        /* Sidebar Styles */
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background: var(--secondary-color);
            border-right: 1px solid var(--accent-color);
            box-shadow: 2px 0 15px rgba(100, 24, 28, 0.1);
            z-index: 1000;
            transition: transform 0.3s ease;
            overflow-y: auto;
        }

        .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--accent-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--primary-color);
            color: var(--secondary-color);
        }

        .sidebar-title {
            color: var(--secondary-color);
            font-weight: 600;
            margin: 0;
            font-size: 1.25rem;
        }

        .sidebar-toggle {
            background: none;
            border: none;
            color: var(--secondary-color);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.25rem;
            display: none;
        }

        .sidebar-toggle:hover {
            color: var(--button-color);
        }

        .sidebar-body {
            padding: 1rem 0;
        }

        .nav-section {
            margin-bottom: 1.5rem;
        }

        .nav-section-title {
            display: block;
            padding: 0.5rem 1.5rem;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .nav-link {
            color: var(--primary-color);
            padding: 0.75rem 1.5rem;
            display: flex;
            align-items: center;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            margin: 0.125rem 0.75rem;
            border-radius: 8px;
            cursor: pointer;
        }

        .nav-link i {
            width: 20px;
            margin-right: 0.75rem;
            font-size: 1.1rem;
        }

        .nav-link:hover {
            background: var(--accent-color);
            color: var(--primary-color);
            transform: translateX(4px);
        }

        .nav-link.active {
            background: var(--primary-color);
            color: var(--secondary-color);
        }

        .nav-link.text-danger {
            color: #dc3545;
        }

        .nav-link.text-danger:hover {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
        }

        /* Main Content */
        .main-content {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
            transition: margin-left 0.3s ease;
        }

        .top-navbar {
            background: rgba(239, 219, 191, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--accent-color);
            padding: 1rem 1.5rem;
            position: sticky;
            top: 0;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(100, 24, 28, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .navbar-left {
            display: flex;
            align-items: center;
        }

        .navbar-toggle {
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.5rem;
            cursor: pointer;
            margin-right: 1rem;
            padding: 0.25rem;
        }

        .page-title {
            color: var(--primary-color);
            font-weight: 600;
            margin: 0;
            font-size: 1.5rem;
        }

        .navbar-right {
            display: flex;
            align-items: center;
            position: relative;
        }

        .user-menu {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: background 0.3s ease;
        }

        .user-menu:hover {
            background: var(--accent-color);
        }

        .avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 2px solid var(--primary-color);
            margin-right: 0.5rem;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--secondary-color);
            border: 1px solid var(--accent-color);
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(100, 24, 28, 0.15);
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1001;
        }

        .dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown-item {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            color: var(--primary-color);
            text-decoration: none;
            transition: background 0.3s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
        }

        .dropdown-item:hover {
            background: var(--accent-color);
        }

        .dropdown-item i {
            margin-right: 0.5rem;
            width: 16px;
        }

        .dropdown-divider {
            height: 1px;
            background: var(--accent-color);
            margin: 0.5rem 0;
        }

        .page-content {
            padding: 2rem 1.5rem;
            min-height: calc(100vh - var(--header-height));
        }

        /* Card Styles */
        .card {
            background: var(--secondary-color);
            border: 1px solid var(--accent-color);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(100, 24, 28, 0.1);
            transition: all 0.3s ease;
            margin-bottom: 1.5rem;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(100, 24, 28, 0.15);
        }

        .card-header {
            background: var(--primary-color);
            color: var(--secondary-color);
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--accent-color);
            border-radius: 12px 12px 0 0;
            font-weight: 600;
        }

        .card-body {
            padding: 1.5rem;
        }

        /* Form Styles */
        .form-group {
            margin-bottom: 1rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--primary-color);
        }

        .form-control {
            width: 100%;
            padding: 0.75rem;
            background: var(--accent-color);
            border: 1px solid var(--button-color);
            border-radius: 8px;
            color: var(--primary-color);
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(100, 24, 28, 0.25);
        }

        .form-control::placeholder {
            color: var(--text-secondary);
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-primary {
            background: var(--button-color);
            color: var(--primary-color);
        }

        .btn-primary:hover {
            background: var(--primary-color);
            color: var(--secondary-color);
            transform: translateY(-1px);
        }

        .btn-outline-primary {
            background: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }

        .btn-outline-primary:hover {
            background: var(--primary-color);
            color: var(--secondary-color);
        }

        /* Sidebar Overlay para móvil */
        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .sidebar-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        /* Estados del sidebar */
        .sidebar-collapsed .sidebar {
            transform: translateX(-100%);
        }

        .sidebar-collapsed .main-content {
            margin-left: 0;
        }

        /* Responsive */
        @media (max-width: 991.98px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .sidebar.show {
                transform: translateX(0);
            }

            .sidebar-toggle {
                display: block;
            }
        }

        @media (max-width: 576px) {
            .page-content {
                padding: 1rem;
            }
            
            .top-navbar {
                padding: 0.75rem 1rem;
            }
            
            .page-title {
                font-size: 1.25rem;
            }

            .user-menu span {
                display: none;
            }
        }

        /* Animaciones */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }

        /* Scrollbar personalizado */
        .sidebar::-webkit-scrollbar {
            width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: var(--accent-color);
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 2px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary);
        }

        /* Alert styles */
        .alert {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid;
        }

        .alert-info {
            background: rgba(239, 219, 191, 0.5);
            border-color: var(--accent-color);
            color: var(--primary-color);
        }

        .alert-success {
            background: rgba(40, 167, 69, 0.1);
            border-color: #28a745;
            color: #155724;
        }

        .alert-warning {
            background: rgba(255, 193, 7, 0.1);
            border-color: #ffc107;
            color: #856404;
        }

        .alert-danger {
            background: rgba(220, 53, 69, 0.1);
            border-color: #dc3545;
            color: #721c24;
        }

        /* Notification styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification-close {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0.7;
        }

        .notification-close:hover {
            opacity: 1;
        }

        /* Grid system simple */
        .row {
            display: flex;
            flex-wrap: wrap;
            margin: -0.5rem;
        }

        .col {
            flex: 1;
            padding: 0.5rem;
        }

        .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
            padding: 0.5rem;
        }

        @media (max-width: 768px) {
            .col-md-6 {
                flex: 0 0 100%;
                max-width: 100%;
            }
        }

        /* Utility classes */
        .text-center { text-align: center; }
        .text-danger { color: #dc3545; }
        .mb-0 { margin-bottom: 0; }
        .mb-3 { margin-bottom: 1rem; }
        .mt-3 { margin-top: 1rem; }
        .d-none { display: none; }
        .d-flex { display: flex; }
        .align-items-center { align-items: center; }
        .justify-content-between { justify-content: space-between; }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div style="display: flex; align-items: center;">
                <span style="font-size: 1.5rem; margin-right: 0.5rem;">🏠</span>
                <h4 class="sidebar-title">Dashboard</h4>
            </div>
            <button class="sidebar-toggle" id="sidebarToggleMobile">
                ✕
            </button>
        </div>
        
        <div class="sidebar-body">
            <nav>
                <div class="nav-section">
                    <small class="nav-section-title">PRINCIPAL</small>
                    <a class="nav-link active" href="#" data-page="dashboard">
                        <span>📊</span>
                        <span>Dashboard</span>
                    </a>
                    <a class="nav-link" href="#" data-page="profile">
                        <span>👤</span>
                        <span>Perfil</span>
                    </a>
                </div>
                
                <div class="nav-section">
                    <small class="nav-section-title">CONFIGURACIÓN</small>
                    <a class="nav-link" href="#" data-page="settings">
                        <span>⚙️</span>
                        <span>Configuración</span>
                    </a>
                    <a class="nav-link" href="#" data-page="notifications">
                        <span>🔔</span>
                        <span>Notificaciones</span>
                    </a>
                </div>
                
                <div class="nav-section">
                    <small class="nav-section-title">OTROS</small>
                    <a class="nav-link" href="#" data-page="help">
                        <span>❓</span>
                        <span>Ayuda</span>
                    </a>
                    <a class="nav-link text-danger" href="#" data-page="logout">
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                    </a>
                </div>
            </nav>
        </div>
    </div>

    <!-- Overlay para móvil -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Contenido principal -->
    <div class="main-content" id="mainContent">
        <!-- Header -->
        <header class="top-navbar">
            <div class="navbar-left">
                <button class="navbar-toggle" id="sidebarToggle">
                    ☰
                </button>
                <h2 class="page-title" id="pageTitle">Dashboard</h2>
            </div>
            
            <div class="navbar-right">
                <div class="user-menu" id="userMenu">
                    <img src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop" 
                         alt="Avatar" class="avatar">
                    <span>Juan Pérez</span>
                    <span style="margin-left: 0.5rem;">▼</span>
                </div>
                <div class="dropdown-menu" id="dropdownMenu">
                    <a class="dropdown-item" href="#" data-page="profile">
                        <span>👤</span>Perfil
                    </a>
                    <a class="dropdown-item" href="#" data-page="settings">
                        <span>⚙️</span>Configuración
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item text-danger" href="#" data-page="logout">
                        <span>🚪</span>Cerrar Sesión
                    </a>
                </div>
            </div>
        </header>

        <!-- Contenido de la página -->
        <main class="page-content" id="pageContent">
            <!-- El contenido se carga dinámicamente aquí -->
        </main>
    </div>

    <script>
        // Definición de páginas
        const Pages = {
            dashboard: {
                title: 'Dashboard',
                content: `
                    <div class="fade-in">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">📊 Estadísticas Generales</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                            <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                                <h3 style="margin: 0; color: var(--primary-color);">1,234</h3>
                                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Usuarios</p>
                                            </div>
                                            <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                                <h3 style="margin: 0; color: var(--primary-color);">567</h3>
                                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Ventas</p>
                                            </div>
                                            <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                                <h3 style="margin: 0; color: var(--primary-color);">89%</h3>
                                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Satisfacción</p>
                                            </div>
                                            <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                                <h3 style="margin: 0; color: var(--primary-color);">$12,345</h3>
                                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Ingresos</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">📈 Actividad Reciente</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="space-y: 1rem;">
                                            <div style="display: flex; align-items: center; padding: 0.75rem; background: var(--accent-color); border-radius: 8px; margin-bottom: 0.5rem;">
                                                <span style="margin-right: 0.75rem;">👤</span>
                                                <div>
                                                    <p style="margin: 0; font-weight: 500;">Nuevo usuario registrado</p>
                                                    <small style="color: var(--text-secondary);">Hace 5 minutos</small>
                                                </div>
                                            </div>
                                            <div style="display: flex; align-items: center; padding: 0.75rem; background: var(--accent-color); border-radius: 8px; margin-bottom: 0.5rem;">
                                                <span style="margin-right: 0.75rem;">💰</span>
                                                <div>
                                                    <p style="margin: 0; font-weight: 500;">Venta completada</p>
                                                    <small style="color: var(--text-secondary);">Hace 15 minutos</small>
                                                </div>
                                            </div>
                                            <div style="display: flex; align-items: center; padding: 0.75rem; background: var(--accent-color); border-radius: 8px; margin-bottom: 0.5rem;">
                                                <span style="margin-right: 0.75rem;">📧</span>
                                                <div>
                                                    <p style="margin: 0; font-weight: 500;">Nuevo mensaje</p>
                                                    <small style="color: var(--text-secondary);">Hace 1 hora</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 style="margin: 0;">🎯 Acciones Rápidas</h5>
                            </div>
                            <div class="card-body">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                                    <button class="btn btn-primary" onclick="showNotification('Función en desarrollo', 'info')">
                                        📝 Crear Nuevo
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="showNotification('Reporte generado exitosamente', 'success')">
                                        📊 Generar Reporte
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="showNotification('Configuración actualizada', 'warning')">
                                        ⚙️ Configurar
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="showNotification('Ayuda disponible', 'info')">
                                        ❓ Obtener Ayuda
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            profile: {
                title: 'Perfil de Usuario',
                content: `
                    <div class="fade-in">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">👤 Información Personal</h5>
                                    </div>
                                    <div class="card-body">
                                        <form id="profileForm">
                                            <div class="form-group">
                                                <label class="form-label">Nombre Completo</label>
                                                <input type="text" class="form-control" value="Juan Pérez" placeholder="Ingresa tu nombre">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Correo Electrónico</label>
                                                <input type="email" class="form-control" value="juan@ejemplo.com" placeholder="tu@email.com">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Teléfono</label>
                                                <input type="tel" class="form-control" value="+1 234 567 8900" placeholder="+1 234 567 8900">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Biografía</label>
                                                <textarea class="form-control" rows="4" placeholder="Cuéntanos sobre ti...">Desarrollador apasionado por crear soluciones innovadoras.</textarea>
                                            </div>
                                            <button type="submit" class="btn btn-primary">💾 Guardar Cambios</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">🔒 Seguridad</h5>
                                    </div>
                                    <div class="card-body">
                                        <form id="passwordForm">
                                            <div class="form-group">
                                                <label class="form-label">Contraseña Actual</label>
                                                <input type="password" class="form-control" placeholder="••••••••">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Nueva Contraseña</label>
                                                <input type="password" class="form-control" placeholder="••••••••">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Confirmar Nueva Contraseña</label>
                                                <input type="password" class="form-control" placeholder="••••••••">
                                            </div>
                                            <button type="submit" class="btn btn-primary">🔐 Cambiar Contraseña</button>
                                        </form>
                                        
                                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--accent-color);">
                                            <h6 style="margin-bottom: 1rem;">🛡️ Autenticación de Dos Factores</h6>
                                            <p style="color: var(--text-secondary); margin-bottom: 1rem;">Agrega una capa extra de seguridad a tu cuenta.</p>
                                            <button class="btn btn-outline-primary">Configurar 2FA</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 style="margin: 0;">📊 Estadísticas del Perfil</h5>
                            </div>
                            <div class="card-body">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                                    <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                        <h4 style="margin: 0; color: var(--primary-color);">156</h4>
                                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Días activo</p>
                                    </div>
                                    <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                        <h4 style="margin: 0; color: var(--primary-color);">23</h4>
                                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Proyectos</p>
                                    </div>
                                    <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                        <h4 style="margin: 0; color: var(--primary-color);">4.8</h4>
                                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Calificación</p>
                                    </div>
                                    <div style="text-align: center; padding: 1rem; background: var(--accent-color); border-radius: 8px;">
                                        <h4 style="margin: 0; color: var(--primary-color);">89%</h4>
                                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Completado</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            settings: {
                title: 'Configuración',
                content: `
                    <div class="fade-in">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">🎨 Apariencia</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <label class="form-label">Tema</label>
                                            <select class="form-control">
                                                <option>Claro</option>
                                                <option>Oscuro</option>
                                                <option>Automático</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Idioma</label>
                                            <select class="form-control">
                                                <option>Español</option>
                                                <option>English</option>
                                                <option>Français</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Zona Horaria</label>
                                            <select class="form-control">
                                                <option>GMT-5 (América/Lima)</option>
                                                <option>GMT-3 (América/Buenos_Aires)</option>
                                                <option>GMT+1 (Europa/Madrid)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">🔔 Notificaciones</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" checked style="margin-right: 0.5rem;">
                                                <span>Notificaciones por email</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" checked style="margin-right: 0.5rem;">
                                                <span>Notificaciones push</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" style="margin-right: 0.5rem;">
                                                <span>Notificaciones SMS</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" checked style="margin-right: 0.5rem;">
                                                <span>Recordatorios</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">🔐 Privacidad y Seguridad</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" checked style="margin-right: 0.5rem;">
                                                <span>Perfil público</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" style="margin-right: 0.5rem;">
                                                <span>Mostrar estado en línea</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" checked style="margin-right: 0.5rem;">
                                                <span>Autenticación de dos factores</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <label style="display: flex; align-items: center; cursor: pointer;">
                                                <input type="checkbox" style="margin-right: 0.5rem;">
                                                <span>Compartir datos de análisis</span>
                                            </label>
                                        </div>
                                        
                                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--accent-color);">
                                            <h6 style="margin-bottom: 1rem;">🗑️ Zona de Peligro</h6>
                                            <button class="btn" style="background: #dc3545; color: white;" onclick="showNotification('Esta acción requiere confirmación', 'warning')">
                                                Eliminar Cuenta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">💾 Respaldo de Datos</h5>
                                    </div>
                                    <div class="card-body">
                                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                                            Último respaldo: 15 de Enero, 2024
                                        </p>
                                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                            <button class="btn btn-outline-primary" onclick="showNotification('Respaldo iniciado', 'info')">
                                                📤 Crear Respaldo
                                            </button>
                                            <button class="btn btn-outline-primary" onclick="showNotification('Descarga iniciada', 'success')">
                                                📥 Descargar Datos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="btn btn-primary" onclick="showNotification('Configuración guardada exitosamente', 'success')">
                                💾 Guardar Todos los Cambios
                            </button>
                        </div>
                    </div>
                `
            },
            notifications: {
                title: 'Notificaciones',
                content: `
                    <div class="fade-in">
                        <div class="card">
                            <div class="card-header">
                                <h5 style="margin: 0;">🔔 Centro de Notificaciones</h5>
                            </div>
                            <div class="card-body">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                    <h6 style="margin: 0;">Notificaciones Recientes</h6>
                                    <button class="btn btn-outline-primary" onclick="showNotification('Todas las notificaciones marcadas como leídas', 'success')">
                                        ✅ Marcar todas como leídas
                                    </button>
                                </div>
                                
                                <div style="space-y: 1rem;">
                                    <div style="display: flex; align-items: start; padding: 1rem; background: var(--accent-color); border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                                        <span style="font-size: 1.5rem; margin-right: 1rem;">💰</span>
                                        <div style="flex: 1;">
                                            <h6 style="margin: 0 0 0.5rem 0;">Nueva venta realizada</h6>
                                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                                                Se ha completado una venta por $299.99. El cliente ha confirmado el pago.
                                            </p>
                                            <small style="color: var(--text-secondary);">Hace 5 minutos</small>
                                        </div>
                                        <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer;">✕</button>
                                    </div>
                                    
                                    <div style="display: flex; align-items: start; padding: 1rem; background: var(--accent-color); border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #28a745;">
                                        <span style="font-size: 1.5rem; margin-right: 1rem;">👤</span>
                                        <div style="flex: 1;">
                                            <h6 style="margin: 0 0 0.5rem 0;">Nuevo usuario registrado</h6>
                                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                                                María González se ha registrado en la plataforma.
                                            </p>
                                            <small style="color: var(--text-secondary);">Hace 15 minutos</small>
                                        </div>
                                        <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer;">✕</button>
                                    </div>
                                    
                                    <div style="display: flex; align-items: start; padding: 1rem; background: rgba(239, 219, 191, 0.3); border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--accent-color); opacity: 0.7;">
                                        <span style="font-size: 1.5rem; margin-right: 1rem;">📧</span>
                                        <div style="flex: 1;">
                                            <h6 style="margin: 0 0 0.5rem 0;">Mensaje de soporte</h6>
                                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                                                Tienes una nueva consulta en el sistema de soporte.
                                            </p>
                                            <small style="color: var(--text-secondary);">Hace 1 hora</small>
                                        </div>
                                        <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer;">✕</button>
                                    </div>
                                    
                                    <div style="display: flex; align-items: start; padding: 1rem; background: rgba(239, 219, 191, 0.3); border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #ffc107; opacity: 0.7;">
                                        <span style="font-size: 1.5rem; margin-right: 1rem;">⚠️</span>
                                        <div style="flex: 1;">
                                            <h6 style="margin: 0 0 0.5rem 0;">Actualización del sistema</h6>
                                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                                                El sistema se actualizará mañana a las 2:00 AM. Duración estimada: 30 minutos.
                                            </p>
                                            <small style="color: var(--text-secondary);">Hace 2 horas</small>
                                        </div>
                                        <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer;">✕</button>
                                    </div>
                                    
                                    <div style="display: flex; align-items: start; padding: 1rem; background: rgba(239, 219, 191, 0.3); border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--accent-color); opacity: 0.7;">
                                        <span style="font-size: 1.5rem; margin-right: 1rem;">📊</span>
                                        <div style="flex: 1;">
                                            <h6 style="margin: 0 0 0.5rem 0;">Reporte mensual disponible</h6>
                                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                                                Tu reporte mensual de enero ya está disponible para descargar.
                                            </p>
                                            <small style="color: var(--text-secondary);">Hace 1 día</small>
                                        </div>
                                        <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer;">✕</button>
                                    </div>
                                </div>
                                
                                <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--accent-color);">
                                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                                        No hay más notificaciones por mostrar
                                    </p>
                                    <button class="btn btn-outline-primary" onclick="showNotification('Historial cargado', 'info')">
                                        📜 Ver Historial Completo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            help: {
                title: 'Centro de Ayuda',
                content: `
                    <div class="fade-in">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">❓ Preguntas Frecuentes</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="margin-bottom: 1.5rem;">
                                            <h6 style="color: var(--primary-color); margin-bottom: 0.5rem;">¿Cómo cambio mi contraseña?</h6>
                                            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">
                                                Ve a tu perfil > Seguridad > Cambiar contraseña. Necesitarás tu contraseña actual.
                                            </p>
                                        </div>
                                        
                                        <div style="margin-bottom: 1.5rem;">
                                            <h6 style="color: var(--primary-color); margin-bottom: 0.5rem;">¿Cómo contacto al soporte?</h6>
                                            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">
                                                Puedes usar el chat en vivo, enviar un email o llamar a nuestro número de soporte.
                                            </p>
                                        </div>
                                        
                                        <div style="margin-bottom: 1.5rem;">
                                            <h6 style="color: var(--primary-color); margin-bottom: 0.5rem;">¿Dónde veo mis facturas?</h6>
                                            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">
                                                Las facturas están disponibles en la sección de Configuración > Facturación.
                                            </p>
                                        </div>
                                        
                                        <div style="margin-bottom: 1.5rem;">
                                            <h6 style="color: var(--primary-color); margin-bottom: 0.5rem;">¿Cómo exporto mis datos?</h6>
                                            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">
                                                Ve a Configuración > Respaldo de Datos > Descargar Datos.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 style="margin: 0;">📞 Contactar Soporte</h5>
                                    </div>
                                    <div class="card-body">
                                        <form id="supportForm">
                                            <div class="form-group">
                                                <label class="form-label">Tipo de Consulta</label>
                                                <select class="form-control">
                                                    <option>Problema técnico</option>
                                                    <option>Pregunta sobre facturación</option>
                                                    <option>Solicitud de función</option>
                                                    <option>Otro</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Asunto</label>
                                                <input type="text" class="form-control" placeholder="Describe brevemente tu consulta">
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Mensaje</label>
                                                <textarea class="form-control" rows="5" placeholder="Describe tu consulta en detalle..."></textarea>
                                            </div>
                                            <button type="submit" class="btn btn-primary">📧 Enviar Mensaje</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 style="margin: 0;">📚 Recursos Útiles</h5>
                            </div>
                            <div class="card-body">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                                    <div style="text-align: center; padding: 1.5rem; background: var(--accent-color); border-radius: 8px;">
                                        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">📖</span>
                                        <h6 style="margin-bottom: 0.5rem;">Documentación</h6>
                                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                                            Guías completas y tutoriales
                                        </p>
                                        <button class="btn btn-outline-primary" onclick="showNotification('Abriendo documentación...', 'info')">
                                            Ver Docs
                                        </button>
                                    </div>
                                    
                                    <div style="text-align: center; padding: 1.5rem; background: var(--accent-color); border-radius: 8px;">
                                        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🎥</span>
                                        <h6 style="margin-bottom: 0.5rem;">Video Tutoriales</h6>
                                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                                            Aprende paso a paso
                                        </p>
                                        <button class="btn btn-outline-primary" onclick="showNotification('Abriendo videos...', 'info')">
                                            Ver Videos
                                        </button>
                                    </div>
                                    
                                    <div style="text-align: center; padding: 1.5rem; background: var(--accent-color); border-radius: 8px;">
                                        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">💬</span>
                                        <h6 style="margin-bottom: 0.5rem;">Comunidad</h6>
                                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                                            Conecta con otros usuarios
                                        </p>
                                        <button class="btn btn-outline-primary" onclick="showNotification('Abriendo foro...', 'info')">
                                            Unirse
                                        </button>
                                    </div>
                                    
                                    <div style="text-align: center; padding: 1.5rem; background: var(--accent-color); border-radius: 8px;">
                                        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🔧</span>
                                        <h6 style="margin-bottom: 0.5rem;">API Reference</h6>
                                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                                            Para desarrolladores
                                        </p>
                                        <button class="btn btn-outline-primary" onclick="showNotification('Abriendo API docs...', 'info')">
                                            Ver API
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            logout: {
                title: 'Cerrar Sesión',
                content: `
                    <div class="fade-in" style="text-align: center; padding: 3rem;">
                        <span style="font-size: 4rem; display: block; margin-bottom: 1rem;">👋</span>
                        <h3 style="margin-bottom: 1rem; color: var(--primary-color);">¡Hasta pronto!</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                            Tu sesión se cerrará en unos segundos...
                        </p>
                        <div style="display: flex; justify-content: center; gap: 1rem;">
                            <button class="btn btn-outline-primary" onclick="loadPage('dashboard'); updateActiveNavItem('dashboard');">
                                ↩️ Cancelar
                            </button>
                            <button class="btn btn-primary" onclick="showNotification('Sesión cerrada exitosamente', 'success')">
                                🚪 Confirmar Salida
                            </button>
                        </div>
                    </div>
                `
            }
        };

        // Aplicación principal
        class SidebarApp {
            constructor() {
                this.currentPage = 'dashboard';
                this.sidebarCollapsed = false;
                this.init();
            }

            init() {
                this.bindEvents();
                this.loadPage('dashboard');
                this.updateActiveNavItem('dashboard');
                
                // Verificar si es móvil y ocultar sidebar
                if (window.innerWidth <= 991.98) {
                    this.hideSidebar();
                }
            }

            bindEvents() {
                // Toggle sidebar desktop
                document.getElementById('sidebarToggle').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleSidebarDesktop();
                });

                // Toggle sidebar móvil
                document.getElementById('sidebarToggleMobile').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.hideSidebar();
                });

                // Overlay click para cerrar sidebar en móvil
                document.getElementById('sidebarOverlay').addEventListener('click', () => {
                    this.hideSidebar();
                });

                // User menu dropdown
                document.getElementById('userMenu').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const dropdown = document.getElementById('dropdownMenu');
                    dropdown.classList.toggle('show');
                });

                // Cerrar dropdown al hacer click fuera
                document.addEventListener('click', () => {
                    const dropdown = document.getElementById('dropdownMenu');
                    dropdown.classList.remove('show');
                });

                // Enlaces de navegación
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.nav-link[data-page]')) {
                        e.preventDefault();
                        const page = e.target.closest('.nav-link[data-page]').getAttribute('data-page');
                        
                        if (page === 'logout') {
                            this.loadPage(page);
                            return;
                        }
                        
                        this.loadPage(page);
                        this.updateActiveNavItem(page);
                        
                        // En móvil, cerrar sidebar después de seleccionar
                        if (window.innerWidth <= 991.98) {
                            this.hideSidebar();
                        }
                    }
                });

                // Enlaces del dropdown también
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.dropdown-item[data-page]')) {
                        e.preventDefault();
                        const page = e.target.closest('.dropdown-item[data-page]').getAttribute('data-page');
                        
                        if (page === 'logout') {
                            this.loadPage(page);
                            return;
                        }
                        
                        this.loadPage(page);
                        this.updateActiveNavItem(page);
                    }
                });

                // Form submissions
                document.addEventListener('submit', (e) => {
                    if (e.target.id === 'profileForm') {
                        e.preventDefault();
                        showNotification('Perfil actualizado exitosamente', 'success');
                    }
                    if (e.target.id === 'passwordForm') {
                        e.preventDefault();
                        showNotification('Contraseña cambiada exitosamente', 'success');
                    }
                    if (e.target.id === 'supportForm') {
                        e.preventDefault();
                        showNotification('Mensaje enviado al soporte', 'success');
                    }
                });

                // Responsive behavior
                window.addEventListener('resize', () => {
                    if (window.innerWidth <= 991.98) {
                        this.hideSidebar();
                        document.body.classList.remove('sidebar-collapsed');
                    } else {
                        this.showSidebar();
                        document.getElementById('sidebarOverlay').classList.remove('show');
                    }
                });

                // Escape key para cerrar sidebar en móvil
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && window.innerWidth <= 991.98) {
                        this.hideSidebar();
                    }
                });
            }

            toggleSidebarDesktop() {
                if (window.innerWidth > 991.98) {
                    document.body.classList.toggle('sidebar-collapsed');
                    this.sidebarCollapsed = !this.sidebarCollapsed;
                } else {
                    this.showSidebar();
                }
            }

            showSidebar() {
                document.getElementById('sidebar').classList.add('show');
                document.getElementById('sidebarOverlay').classList.add('show');
            }

            hideSidebar() {
                document.getElementById('sidebar').classList.remove('show');
                document.getElementById('sidebarOverlay').classList.remove('show');
            }

            loadPage(pageKey) {
                const page = Pages[pageKey];
                
                if (!page) {
                    console.error(`Página "${pageKey}" no encontrada`);
                    return;
                }

                // Actualizar título
                document.getElementById('pageTitle').textContent = page.title;
                document.title = `${page.title} - Sistema de Administración`;

                // Cargar contenido con animación
                const content = document.getElementById('pageContent');
                content.style.opacity = '0';
                
                setTimeout(() => {
                    content.innerHTML = page.content;
                    content.style.opacity = '1';
                }, 200);

                this.currentPage = pageKey;
            }

            updateActiveNavItem(pageKey) {
                // Remover clase active de todos los enlaces
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Agregar clase active al enlace actual
                const activeLink = document.querySelector(`.nav-link[data-page="${pageKey}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }

            // Método para agregar nuevas páginas dinámicamente
            addPage(key, pageConfig) {
                Pages[key] = pageConfig;
                console.log(`Página "${key}" agregada exitosamente`);
            }

            // Método para agregar nuevos elementos al sidebar
            addNavItem(sectionSelector, navItem) {
                const section = document.querySelector(sectionSelector);
                if (section) {
                    section.insertAdjacentHTML('afterend', navItem);
                    console.log('Elemento de navegación agregado');
                }
            }

            // Método para obtener la página actual
            getCurrentPage() {
                return this.currentPage;
            }
        }

        // Función global para mostrar notificaciones
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification alert alert-${type} show`;
            
            const iconMap = {
                success: '✅',
                warning: '⚠️',
                danger: '❌',
                info: 'ℹ️'
            };
            
            notification.innerHTML = `
                <span style="margin-right: 0.5rem;">${iconMap[type] || 'ℹ️'}</span>
                ${message}
                <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove después de 5 segundos
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.transform = 'translateX(400px)';
                    setTimeout(() => {
                        if (notification.parentElement) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }

        // Funciones globales para compatibilidad
        function loadPage(pageKey) {
            window.App.loadPage(pageKey);
        }

        function updateActiveNavItem(pageKey) {
            window.App.updateActiveNavItem(pageKey);
        }

        // Ejemplos de cómo agregar nuevas páginas y elementos de navegación
        const PageExamples = {
            // Ejemplo de cómo agregar una nueva página
            addSamplePage() {
                App.addPage('sample', {
                    title: 'Página de Ejemplo',
                    content: `
                        <div class="fade-in">
                            <div class="card">
                                <div class="card-header">
                                    <h5 style="margin: 0;">Esta es una página de ejemplo</h5>
                                </div>
                                <div class="card-body">
                                    <p>Aquí puedes agregar el contenido de tu nueva página.</p>
                                    <button class="btn btn-primary" onclick="showNotification('¡Funciona perfectamente!', 'success')">
                                        Probar Notificación
                                    </button>
                                </div>
                            </div>
                        </div>
                    `
                });
            },

            // Ejemplo de cómo agregar un nuevo elemento al sidebar
            addSampleNavItem() {
                const navItem = `
                    <a class="nav-link" href="#" data-page="sample">
                        <span>💡</span>
                        <span>Página de Ejemplo</span>
                    </a>
                `;
                
                App.addNavItem('.nav-section:first-child .nav-section-title', navItem);
            }
        };

        // Inicializar la aplicación cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            // Crear instancia global de la aplicación
            window.App = new SidebarApp();
            
            // Ejemplo de uso: descomenta las siguientes líneas para probar
            PageExamples.addSamplePage();
            PageExamples.addSampleNavItem();
            
            console.log('Sistema de Sidebar inicializado correctamente');
            console.log('Para agregar nuevas páginas, usa: App.addPage(key, config)');
            console.log('Para mostrar notificaciones, usa: showNotification(message, type)');
        });
    </script>
</body>
</html>