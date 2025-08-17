#!/bin/bash

# Script de instalación de Nginx para roepard-login con SSL
# Ejecutar como root: sudo bash install-nginx-roepard-login.sh

set -e

echo "🚀 Iniciando instalación de Nginx para roepard-login..."

# Variables
DOMAIN="roepard-login.com"
SITE_NAME="roepard-login"
DOCUMENT_ROOT="/var/www/roepard-login"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si se ejecuta como root
if [[ $EUID -ne 0 ]]; then
   print_error "Este script debe ejecutarse como root (sudo)"
   exit 1
fi

# Paso 1: Instalar Nginx si no está instalado
print_status "Verificando instalación de Nginx..."
if ! command -v nginx &> /dev/null; then
    print_status "Instalando Nginx..."
    apt update
    apt install -y nginx
else
    print_status "Nginx ya está instalado"
fi

# Paso 2: Crear directorio del proyecto
print_status "Creando directorio del proyecto..."
mkdir -p $DOCUMENT_ROOT
chown -R www-data:www-data $DOCUMENT_ROOT
chmod -R 755 $DOCUMENT_ROOT

# Paso 3: Crear archivo de configuración de Nginx
print_status "Creando configuración de Nginx..."
cat > $NGINX_SITES_AVAILABLE/$SITE_NAME << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name roepard-login.com www.roepard-login.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name roepard-login.com www.roepard-login.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/roepard-login.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/roepard-login.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Document Root
    root /var/www/roepard-login;
    index index.html index.htm index.php;
    
    # Logs
    access_log /var/log/nginx/roepard-login.access.log;
    error_log /var/log/nginx/roepard-login.error.log;
    
    # Main Location Block
    location / {
        try_files $uri $uri/ /index.html;
        
        # Security: Deny access to hidden files
        location ~ /\. {
            deny all;
        }
        
        # Security: Deny access to sensitive files
        location ~* \.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
            deny all;
        }
    }
    
    # Handle PHP files (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# Paso 4: Habilitar el sitio
print_status "Habilitando el sitio..."
ln -sf $NGINX_SITES_AVAILABLE/$SITE_NAME $NGINX_SITES_ENABLED/

# Paso 5: Deshabilitar el sitio por defecto
print_status "Deshabilitando sitio por defecto..."
if [[ -L $NGINX_SITES_ENABLED/default ]]; then
    rm $NGINX_SITES_ENABLED/default
fi

# Paso 6: Instalar Certbot para SSL
print_status "Instalando Certbot para certificados SSL..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
else
    print_status "Certbot ya está instalado"
fi

# Paso 7: Crear archivo de prueba
print_status "Creando archivo de prueba..."
cat > $DOCUMENT_ROOT/index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roepard Login - Configuración Exitosa</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 3rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 {
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .status {
            background: rgba(76, 175, 80, 0.2);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid rgba(76, 175, 80, 0.5);
        }
        .next-steps {
            margin-top: 2rem;
            text-align: left;
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 10px;
        }
        .next-steps h3 {
            margin-top: 0;
            color: #ffd700;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 1.5rem;
        }
        .next-steps li {
            margin: 0.5rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 ¡Configuración Exitosa!</h1>
        <p>Tu proyecto roepard-login está funcionando correctamente con Nginx</p>
        
        <div class="status">
            ✅ Nginx configurado<br>
            ✅ Sitio habilitado<br>
            ✅ Document root: /var/www/roepard-login
        </div>
        
        <div class="next-steps">
            <h3>📋 Próximos pasos:</h3>
            <ul>
                <li>Configurar tu dominio DNS para apuntar a este servidor</li>
                <li>Ejecutar: <code>sudo certbot --nginx -d roepard-login.com -d www.roepard-login.com</code></li>
                <li>Subir tu código al directorio /var/www/roepard-login</li>
                <li>Reiniciar Nginx: <code>sudo systemctl restart nginx</code></li>
            </ul>
        </div>
    </div>
</body>
</html>
EOF

# Paso 8: Verificar configuración de Nginx
print_status "Verificando configuración de Nginx..."
if nginx -t; then
    print_status "Configuración de Nginx es válida"
else
    print_error "Error en la configuración de Nginx"
    exit 1
fi

# Paso 9: Reiniciar Nginx
print_status "Reiniciando Nginx..."
systemctl restart nginx
systemctl enable nginx

# Paso 10: Configurar firewall (si está disponible)
print_status "Configurando firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    print_status "Firewall configurado para Nginx"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    print_status "Firewall configurado para Nginx"
else
    print_warning "No se detectó firewall, configúralo manualmente"
fi

# Paso 11: Mostrar información final
echo ""
echo "🎯 INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "======================================"
echo ""
echo "📁 Directorio del proyecto: $DOCUMENT_ROOT"
echo "🌐 Configuración Nginx: $NGINX_SITES_AVAILABLE/$SITE_NAME"
echo "🔗 Sitio habilitado en: $NGINX_SITES_ENABLED/$SITE_NAME"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Configura tu dominio DNS para apuntar a este servidor"
echo "2. Ejecuta: sudo certbot --nginx -d roepard-login.com -d www.roepard-login.com"
echo "3. Sube tu código al directorio $DOCUMENT_ROOT"
echo "4. Reinicia Nginx: sudo systemctl restart nginx"
echo ""
echo "🔍 VERIFICAR ESTADO:"
echo "- Nginx: sudo systemctl status nginx"
echo "- Sitio: curl -I http://localhost"
echo "- Logs: sudo tail -f /var/log/nginx/roepard-login.access.log"
echo ""
echo "✅ ¡Tu proyecto roepard-login está listo!"