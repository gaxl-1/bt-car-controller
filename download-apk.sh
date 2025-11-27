#!/bin/bash

# Script para descargar el APK generado por EAS Build

echo "📥 Descargando APK..."
echo ""

# Descargar el APK
eas build:download --platform android --profile preview --output ./builds/bt-car-controller.apk

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ APK descargado exitosamente!"
    echo ""
    echo "📁 Ubicación: ./builds/bt-car-controller.apk"
    echo ""
    echo "📱 Próximos pasos:"
    echo "   1. Transfiere el APK a tu dispositivo Android"
    echo "   2. Habilita 'Instalar apps de fuentes desconocidas'"
    echo "   3. Abre el APK y presiona 'Instalar'"
    echo "   4. ¡Prueba la app con tu carrito Arduino!"
    echo ""
    ls -lh ./builds/bt-car-controller.apk
else
    echo ""
    echo "❌ Error al descargar. Intenta manualmente:"
    echo "   Descarga desde: https://expo.dev/accounts/gaxl-1/projects/bt-car-controller/builds/dea0c2dd-27cd-4ff2-bf9e-32898c038414"
fi
