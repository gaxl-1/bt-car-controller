# 📦 Instrucciones de Compilación (Build)

Esta guía explica cómo generar el archivo APK de la aplicación para instalarlo en cualquier dispositivo Android.

---

## ⚡ Opción Rápida (Script Automático)

El proyecto incluye un script para automatizar el proceso. Desde la raíz del proyecto ejecuta:

```bash
./build-apk.sh
```

Sigue las instrucciones en pantalla.

---

## 🛠️ Opción Manual (EAS Build)

Si prefieres usar los comandos de Expo manualmente:

### 1. Iniciar Sesión en Expo
Si aún no lo has hecho:
```bash
eas login
```

### 2. Ejecutar el Build
Para generar un APK estándar (no AAB de Play Store):
```bash
eas build --platform android --profile preview
```

### 3. Esperar y Descargar
- El proceso se ejecuta en la nube y tarda entre 10 y 20 minutos.
- Al finalizar, la terminal mostrará un enlace de descarga.
- También puedes descargar el último build con:
  ```bash
  eas build:download --platform android --profile preview
  ```

---

## 📱 Instalación del APK

Una vez descargado el archivo `.apk`:

1.  Transfiérelo a tu dispositivo Android.
2.  Abre el archivo desde un explorador de archivos.
3.  Si se solicita, habilita "Instalar de fuentes desconocidas".
4.  Presiona "Instalar".

Consulta la [Guía de Instalación](APK_INSTALLATION_GUIDE.md) para más detalles.
