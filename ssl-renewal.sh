#!/bin/bash

# Script para renovación automática de certificados SSL
# Este script debe ejecutarse desde cron para renovar automáticamente los certificados

set -e

echo "🔄 Iniciando renovación de certificados SSL..."

# Variables
DOMAIN="roepard-login.com"
LOG_FILE="/var/log/ssl-renewal.log"

# Función para logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Verificar si se ejecuta como root
if [[ $EUID -ne 0 ]]; then
   log_message "ERROR: Este script debe ejecutarse como root"
   exit 1
fi

# Verificar si Certbot está instalado
if ! command -v certbot &> /dev/null; then
    log_message "ERROR: Certbot no está instalado"
    exit 1
fi

# Intentar renovar certificados
log_message "Intentando renovar certificados para $DOMAIN..."

if certbot renew --quiet --nginx; then
    log_message "✅ Certificados renovados exitosamente"
    
    # Reiniciar Nginx para aplicar cambios
    if systemctl restart nginx; then
        log_message "✅ Nginx reiniciado exitosamente"
    else
        log_message "❌ Error al reiniciar Nginx"
    fi
else
    log_message "❌ Error al renovar certificados"
    exit 1
fi

log_message "🔄 Proceso de renovación completado"