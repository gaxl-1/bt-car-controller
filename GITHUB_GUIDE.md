# 🐙 Guía para Publicar en GitHub

Sigue estos pasos para subir tu proyecto a GitHub y compartir el APK con el mundo.

## 1. Preparar el Repositorio Local

Asegúrate de estar en la carpeta del proyecto:

```bash
cd "/home/gael/Escritorio/BT CAR 27/BluetoothCarController"
```

Verifica que los archivos innecesarios (como `node_modules` o la carpeta `android` generada) estén ignorados. El archivo `.gitignore` ya debería encargarse de esto, pero es bueno confirmar.

## 2. Crear un Repositorio en GitHub

1.  Ve a [github.com/new](https://github.com/new).
2.  Nombre del repositorio: `bt-car-controller` (o el que prefieras).
3.  Descripción: "Control remoto para carritos Arduino con React Native".
4.  Público: ✅
5.  **No** inicialices con README, .gitignore o licencia (ya los tenemos).
6.  Haz clic en **Create repository**.

## 3. Subir el Código

Copia los comandos que te da GitHub bajo "...or push an existing repository from the command line". Serán parecidos a estos (reemplaza `TU_USUARIO`):

```bash
git remote add origin https://github.com/TU_USUARIO/bt-car-controller.git
git branch -M main
git add .
git commit -m "Versión inicial: App completa con documentación"
git push -u origin main
```

> **Nota**: Si te pide contraseña, usa tu *Personal Access Token* de GitHub, no tu contraseña de cuenta.

## 4. Publicar el APK (Releases)

La forma profesional de distribuir binarios en GitHub es usando "Releases".

1.  Ve a la página principal de tu repositorio en GitHub.
2.  A la derecha, busca la sección **Releases** y haz clic en **Create a new release**.
3.  **Choose a tag**: Escribe `v1.0.0` y selecciona "Create new tag".
4.  **Release title**: `Versión 1.0.0 - Lanzamiento Inicial`.
5.  **Describe this release**:
    ```markdown
    Primera versión estable de BT Car Controller.
    
    Características:
    - Control direccional completo
    - Conexión Bluetooth estable
    - Diseño moderno
    ```
6.  **Attach binaries**: Arrastra y suelta tu archivo `BT CAR 27.apk` (que está en la carpeta `builds/`) en el recuadro de subida.
7.  Haz clic en **Publish release**.

¡Listo! Ahora cualquiera puede descargar el APK desde la sección "Assets" de tu Release.
