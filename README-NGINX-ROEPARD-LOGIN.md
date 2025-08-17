# 🚀 Configuración de Nginx para Roepard Login

Este proyecto incluye una configuración completa de Nginx con SSL para tu proyecto `roepard-login` ubicado en `/var/www/roepard-login/*`.

## 📋 Archivos Incluidos

- `roepard-login-nginx.conf` - Configuración de Nginx
- `install-nginx-roepard-login.sh` - Script de instalación automática
- `ssl-renewal.sh` - Script para renovación automática de SSL
- `README-NGINX-ROEPARD-LOGIN.md` - Este archivo

## 🎯 Características de la Configuración

### ✅ Seguridad
- **SSL/TLS** con certificados Let's Encrypt
- **HTTP/2** habilitado
- **Headers de seguridad** (HSTS, X-Frame-Options, etc.)
- **Denegación de acceso** a archivos sensibles
- **Cifrados SSL** modernos y seguros

### ✅ Rendimiento
- **Compresión Gzip** para archivos estáticos
- **Cache de archivos estáticos** con expiración de 1 año
- **HTTP/2** para mejor rendimiento
- **Optimización de sesiones SSL**

### ✅ Funcionalidad
- **Redirección automática** de HTTP a HTTPS
- **Soporte para PHP** (si es necesario)
- **Logs separados** para el proyecto
- **Manejo de SPA** (Single Page Applications)

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática (Recomendada)

```bash
# 1. Descargar el script
wget https://tu-servidor.com/install-nginx-roepard-login.sh

# 2. Dar permisos de ejecución
chmod +x install-nginx-roepard-login.sh

# 3. Ejecutar como root
sudo bash install-nginx-roepard-login.sh
```

### Opción 2: Instalación Manual

```bash
# 1. Instalar Nginx
sudo apt update
sudo apt install -y nginx

# 2. Crear directorio del proyecto
sudo mkdir -p /var/www/roepard-login
sudo chown -R www-data:www-data /var/www/roepard-login
sudo chmod -R 755 /var/www/roepard-login

# 3. Copiar configuración
sudo cp roepard-login-nginx.conf /etc/nginx/sites-available/roepard-login

# 4. Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/roepard-login /etc/nginx/sites-enabled/

# 5. Deshabilitar sitio por defecto
sudo rm -f /etc/nginx/sites-enabled/default

# 6. Verificar configuración
sudo nginx -t

# 7. Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔐 Configuración de SSL

### 1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtener Certificado SSL

```bash
# Reemplaza 'roepard-login.com' con tu dominio real
sudo certbot --nginx -d roepard-login.com -d www.roepard-login.com
```

### 3. Renovación Automática

```bash
# Agregar al crontab para renovación automática
sudo crontab -e

# Agregar esta línea:
0 12 * * * /usr/bin/bash /ruta/a/ssl-renewal.sh
```

## 📁 Estructura de Directorios

```
/var/www/roepard-login/          # Directorio raíz del proyecto
├── index.html                   # Archivo principal
├── css/                         # Estilos CSS
├── js/                          # JavaScript
├── images/                      # Imágenes
└── ...                          # Otros archivos del proyecto
```

## 🔧 Configuración de Nginx

### Archivo Principal
- **Ubicación**: `/etc/nginx/sites-available/roepard-login`
- **Habilitado en**: `/etc/nginx/sites-enabled/roepard-login`

### Características de la Configuración

```nginx
# Puerto 80: Redirección a HTTPS
server {
    listen 80;
    server_name roepard-login.com www.roepard-login.com;
    return 301 https://$server_name$request_uri;
}

# Puerto 443: Configuración SSL
server {
    listen 443 ssl http2;
    server_name roepard-login.com www.roepard-login.com;
    
    # SSL y seguridad
    ssl_certificate /etc/letsencrypt/live/roepard-login.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/roepard-login.com/privkey.pem;
    
    # Document root
    root /var/www/roepard-login;
    
    # Manejo de archivos
    try_files $uri $uri/ /index.html;
}
```

## 🛡️ Configuración de Firewall

### UFW (Ubuntu)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Firewalld (CentOS/RHEL)
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 📊 Monitoreo y Logs

### Logs de Acceso
```bash
# Ver logs en tiempo real
sudo tail -f /var/log/nginx/roepard-login.access.log

# Ver logs de error
sudo tail -f /var/log/nginx/roepard-login.error.log
```

### Estado del Servicio
```bash
# Estado de Nginx
sudo systemctl status nginx

# Verificar configuración
sudo nginx -t

# Reiniciar servicio
sudo systemctl restart nginx
```

## 🔍 Comandos Útiles

### Verificar Configuración
```bash
# Verificar sintaxis de Nginx
sudo nginx -t

# Ver configuración cargada
sudo nginx -T

# Ver puertos en uso
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### Gestión de Sitios
```bash
# Listar sitios habilitados
ls -la /etc/nginx/sites-enabled/

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/roepard-login /etc/nginx/sites-enabled/

# Deshabilitar sitio
sudo rm /etc/nginx/sites-enabled/roepard-login
```

## 🚨 Solución de Problemas

### Error: "Permission Denied"
```bash
# Verificar permisos del directorio
sudo chown -R www-data:www-data /var/www/roepard-login
sudo chmod -R 755 /var/www/roepard-login
```

### Error: "SSL Certificate Not Found"
```bash
# Verificar que el certificado existe
sudo ls -la /etc/letsencrypt/live/roepard-login.com/

# Renovar certificado
sudo certbot renew --nginx
```

### Error: "Port Already in Use"
```bash
# Ver qué está usando el puerto 80/443
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Detener servicio conflictivo
sudo systemctl stop apache2  # Si Apache está corriendo
```

## 📝 Personalización

### Cambiar Dominio
1. Editar `/etc/nginx/sites-available/roepard-login`
2. Reemplazar `roepard-login.com` con tu dominio
3. Actualizar certificados SSL
4. Reiniciar Nginx

### Agregar Subdominios
```nginx
server {
    listen 443 ssl http2;
    server_name api.roepard-login.com;
    
    root /var/www/roepard-login/api;
    # ... resto de configuración
}
```

### Configurar PHP-FPM
```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.1-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

## 🔄 Mantenimiento

### Actualización de Nginx
```bash
sudo apt update
sudo apt upgrade nginx
sudo systemctl restart nginx
```

### Limpieza de Logs
```bash
# Rotar logs automáticamente
sudo logrotate -f /etc/logrotate.d/nginx

# Limpiar logs antiguos
sudo find /var/log/nginx -name "*.log.*" -mtime +30 -delete
```

### Backup de Configuración
```bash
# Crear backup
sudo cp -r /etc/nginx /etc/nginx.backup.$(date +%Y%m%d)

# Restaurar backup
sudo cp -r /etc/nginx.backup.20231201 /etc/nginx
```

## 📞 Soporte

Si encuentras problemas:

1. **Verificar logs**: `/var/log/nginx/roepard-login.error.log`
2. **Verificar configuración**: `sudo nginx -t`
3. **Verificar permisos**: `ls -la /var/www/roepard-login/`
4. **Verificar SSL**: `sudo certbot certificates`

## 🎉 ¡Listo!

Tu proyecto `roepard-login` ahora está configurado con:
- ✅ Nginx optimizado
- ✅ SSL/TLS habilitado
- ✅ Seguridad reforzada
- ✅ Rendimiento optimizado
- ✅ Logs organizados
- ✅ Renovación automática de SSL

¡Disfruta de tu servidor web seguro y rápido! 🚀