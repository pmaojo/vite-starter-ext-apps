# Guía de Desarrollo: 02 - Entorno Vite y Empaquetado

En el capítulo anterior establecimos que nuestra UI es una aplicación frontend separada del Servidor y del Host. En este capítulo exploraremos cómo empaquetamos ese frontend.

El gran desafío técnico de distribuir interfaces para MCP es que no queremos obligar a los usuarios a desplegar clústeres complejos con servidores web estáticos separados solo para servir un formulario web. Queremos simplicidad.

## El Problema: Sirviendo Archivos en MCP

Típicamente, una app en React compilada genera una carpeta con múltiples archivos: un `index.html`, varios archivos `.js`, archivos `.css`, imágenes, etc.

Cuando el Servidor MCP necesita entregarle esta Interfaz al Host, manejar docenas de archivos sueltos (o problemas de rutas relativas) es propenso a errores, especialmente si el servidor backend se despliega como una función Serverless en plataformas como Vercel o AWS Lambda.

## La Solución: Un Único Archivo con Vite

Para resolver esto, utilizamos **Vite** en combinación con el plugin `vite-plugin-singlefile`.

El objetivo de esta configuración es que, sin importar cuán compleja sea nuestra aplicación React (cuántos componentes, librerías o estilos CSS tengamos), Vite la compilará en **un único archivo HTML independiente**.

### ¿Cómo funciona el plugin Single-File?

En lugar de crear archivos `.js` y `.css` separados y enlazarlos en el HTML `<link rel="stylesheet" ...>`, el plugin toma todo tu código JavaScript y todo tu código CSS compilado, y lo **inyecta (inline)** directamente dentro de las etiquetas `<script>` y `<style>` de un archivo llamado `mcp-app.html`.

Esto significa que `mcp-app.html` es 100% portátil. Puedes enviarlo por red, leerlo de un disco, o servirlo en una respuesta HTTP, y funcionará de inmediato porque contiene todo lo que necesita dentro de sí mismo.

## Comandos de Empaquetado (Build Flavors)

Nuestro proyecto (`package.json`) define dos formas principales de compilar el sistema, dependiendo de lo que necesites hacer:

### 1. `npm run build:ui` (Solo Frontend estático)

Este comando le dice a Vite que tome el código en la carpeta `src/`, resuelva las dependencias de React, procese el TailwindCSS, y agrupe todo.

**Resultado:** Genera un único archivo `mcp-app.html`.
Si abres este archivo en tu editor de texto, verás miles de líneas de código en un solo archivo. Esta es tu App de UI lista para ser servida.

### 2. `npm run build:full` (Sistema Completo: UI + Backend)

Este es el comando por defecto para producción. Hace dos cosas:

1. Ejecuta primero `build:ui` para generar el `mcp-app.html`.
2. Luego utiliza el compilador de TypeScript (`tsc` o herramientas similares configuradas) para compilar el backend Node.js (`server.ts`, `main.ts`) y lo coloca en la carpeta `dist/`.

**Resultado:** Una carpeta `dist/` que contiene tanto el servidor MCP compilado en JavaScript, listo para ejecutarse con Node, como el archivo `mcp-app.html` listo para ser entregado a los Hosts.

## Consideraciones para Serverless (ej. Vercel)

Una de las ventajas de tener la UI en un solo archivo HTML es que facilita enormemente el despliegue en entornos Serverless.

En nuestro proyecto, verás un archivo `vercel.json` y/o una ruta `api/index.ts`. Esto está configurado para que cuando una petición HTTP llegue a la raíz (`/`), la función Serverless simplemente lea el archivo `mcp-app.html` y lo devuelva directamente con un encabezado `Content-Type: text/html`. No hay que configurar complejas reglas de ruteo para assets estáticos.

---

En el siguiente y último capítulo (**03 - Desarrollo de UI React y MCP**), veremos cómo programar el día a día usando React, componentes de Shadcn, y cómo nos comunicamos exactamente con el Host mediante el SDK de MCP.
