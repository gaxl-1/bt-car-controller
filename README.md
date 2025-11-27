# 🚗 Bluetooth Car Controller

**Control Remoto para Carritos Arduino con React Native**

![Banner](https://img.shields.io/badge/React%20Native-v0.76-blue) ![Banner](https://img.shields.io/badge/Expo-SDK%2052-black) ![Banner](https://img.shields.io/badge/Platform-Android-green)

Una aplicación móvil moderna y elegante para controlar carritos Arduino (HC-05/HC-06) vía Bluetooth. Desarrollada con React Native y Expo, diseñada para ser intuitiva, visualmente atractiva y fácil de usar.

---

## ✨ Características

- **🎮 Control Intuitivo**: Pad direccional (Adelante, Atrás, Izquierda, Derecha) con respuesta táctil.
- **⚙️ Configuración Personalizable**:
  - **Mapeo de Botones**: Personaliza los caracteres que se envían al Arduino.
  - **Modo de Control**: Elige entre "Mantener pulsado" o "Interruptor" (toque).
  - **Vibración**: Activa o desactiva el feedback háptico.
- **📡 Conexión Bluetooth**: Escaneo y conexión rápida con módulos HC-05 y HC-06.
- **🎨 Diseño Moderno**: Interfaz oscura con gradientes, efectos de vidrio (glassmorphism) y animaciones fluidas.
- **📱 Soporte Android**: Optimizada para dispositivos Android (5.0+).

---

## 🚀 Instalación Rápida (APK)

Si solo quieres usar la aplicación, descarga el APK desde la sección de [Releases](https://github.com/tu-usuario/tu-repo/releases) (una vez publicado) o usa el archivo generado en la carpeta `builds/`.

Consulta la [Guía de Instalación](APK_INSTALLATION_GUIDE.md) para instrucciones detalladas.

---

## 🛠️ Configuración del Arduino

La aplicación envía los siguientes caracteres vía Bluetooth Serial a 9600 baudios:

| Botón | Carácter Enviado | Acción |
| :--- | :---: | :--- |
| **Adelante** | `F` | Mover hacia adelante |
| **Atrás** | `B` | Mover hacia atrás |
| **Izquierda** | `L` | Girar a la izquierda |
| **Derecha** | `R` | Girar a la derecha |
| **Soltar** | `S` | Detener motores |

### Ejemplo de Código Arduino

```cpp
#include <SoftwareSerial.h>

SoftwareSerial BT(10, 11); // RX, TX

void setup() {
  BT.begin(9600);
  // Configura tus pines de motor aquí
}

void loop() {
  if (BT.available()) {
    char command = BT.read();
    
    switch(command) {
      case 'F': moveForward(); break;
      case 'B': moveBackward(); break;
      case 'L': turnLeft(); break;
      case 'R': turnRight(); break;
      case 'S': stopMotors(); break;
    }
  }
}
```

---

## 💻 Desarrollo

Si deseas modificar el código o contribuir al proyecto:

### Prerrequisitos

- Node.js (LTS)
- Android Studio (para emulador) o dispositivo físico Android
- Expo CLI (`npm install -g eas-cli`)

### Instalación del Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/bt-car-controller.git
   cd bt-car-controller
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npx expo start --dev-client
   ```

> **Nota**: Para probar la funcionalidad Bluetooth, necesitas usar un dispositivo físico y generar una *Development Build*, ya que Bluetooth no funciona en Expo Go estándar.

Consulta la [Guía de Desarrollo](DEVELOPMENT.md) para más detalles.

---

## 📱 Generar APK

Para generar el archivo instalable (APK):

```bash
eas build --platform android --profile preview
```

Consulta las [Instrucciones de Build](BUILD_INSTRUCTIONS.md) para más detalles.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo y modificarlo para tus proyectos personales o educativos.

---

Hecho con ❤️ y React Native.
