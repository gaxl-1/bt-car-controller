# 🛠️ Guía de Desarrollo

Esta guía está destinada a desarrolladores que deseen modificar, mejorar o compilar el código fuente de la aplicación **BT Car Controller**.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1.  **Node.js** (versión LTS recomendada): [Descargar](https://nodejs.org/)
2.  **Git**: [Descargar](https://git-scm.com/)
3.  **Java Development Kit (JDK) 17**: Requerido para compilar en Android.
4.  **Android Studio**: Para gestionar el SDK de Android y dispositivos virtuales (opcional si usas dispositivo físico).
5.  **EAS CLI**: Herramienta de construcción de Expo.
    ```bash
    npm install -g eas-cli
    ```

---

## 🚀 Configuración del Entorno

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd BluetoothCarController
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

---

## 📱 Ejecutar la Aplicación

### Modo Bare Workflow

Este proyecto utiliza el "Bare Workflow" de Expo para soportar la librería nativa de Bluetooth. Esto significa que **no puedes usar la app Expo Go** de la Play Store. Necesitas generar una "Development Build".

#### 1. Generar Development Build (Primera vez)

Conecta tu dispositivo Android y ejecuta:

```bash
npx expo run:android
```

Esto compilará e instalará la app en tu dispositivo en modo desarrollo.

#### 2. Iniciar Servidor de Desarrollo

Una vez instalada la app en el dispositivo:

```bash
npx expo start --dev-client
```

Escanea el código QR o presiona 'a' en la terminal para conectar la app al servidor.

---

## 📂 Estructura del Proyecto

-   **`App.js`**: Punto de entrada de la aplicación.
-   **`components/`**: Componentes reutilizables de UI.
    -   `ControlButtons.js`: Pad direccional.
    -   `DeviceSelector.js`: Modal de escaneo Bluetooth.
    -   `ConnectionStatus.js`: Indicador de estado.
    -   `Logo.js`: Logotipo animado.
-   **`screens/`**: Pantallas completas.
    -   `HomeScreen.js`: Pantalla principal y lógica de orquestación.
-   **`services/`**: Lógica de negocio y comunicación.
    -   `BluetoothService.js`: Singleton para manejo de Bluetooth Serial.
-   **`styles/`**: Estilos globales y tema.
    -   `theme.js`: Paleta de colores y constantes.
    -   `globalStyles.js`: Estilos compartidos.
-   **`android/`**: Código nativo de Android (generado).

---

## 🔧 Solución de Problemas Comunes

### Error: `Task :app:installDebug FAILED`
- Asegúrate de tener habilitada la depuración USB en tu dispositivo.
- Verifica que el dispositivo sea visible con `adb devices`.

### Error con `react-native-bluetooth-classic`
- Si modificas dependencias nativas, necesitas reconstruir la app con `npx expo run:android`.
- Asegúrate de que los permisos en `AndroidManifest.xml` (dentro de `android/app/src/main/`) sean correctos.

### El Bluetooth no escanea
- En Android 12+, asegúrate de haber concedido los permisos de "Dispositivos cercanos" (Nearby Devices) y "Ubicación".
- La app solicita estos permisos automáticamente al iniciar.

---

## 📦 Generar APK para Producción

Para generar un APK instalable para compartir:

```bash
eas build --platform android --profile preview
```

Consulta [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) para más detalles.
