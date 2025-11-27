#!/bin/bash

# Script para generar APK con EAS Build
# Este script debe ejecutarse desde la raíz del proyecto

echo "🚀 Generando APK para BT Car Controller..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "app.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que el usuario está logueado
echo "📝 Verificando login de Expo..."
if ! eas whoami &> /dev/null; then
    echo "❌ No estás logueado en Expo"
    echo "Por favor ejecuta: eas login"
    exit 1
fi

echo "✅ Usuario logueado correctamente"
echo ""

# Iniciar el build
echo "🔨 Iniciando build de APK..."
echo "Esto puede tomar 10-20 minutos..."
echo ""

eas build --platform android --profile preview --non-interactive

# Verificar si el build fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Build completado exitosamente!"
    echo ""
    echo "📥 Para descargar el APK ejecuta:"
    echo "   eas build:download --platform android --profile preview"
    echo ""
    echo "O descárgalo desde el link que aparece arriba"
else
    echo ""
    echo "❌ El build falló. Revisa los errores arriba."
    exit 1
fi
