# Guía de Desarrollo: 01 - Introducción y Arquitectura

¡Bienvenido al equipo de desarrollo! Esta guía está diseñada para que entiendas a fondo cómo está construida nuestra aplicación y, sobre todo, cómo interactúan sus distintas partes. Vamos a desmitificar la arquitectura para que puedas desarrollar nuevas interfaces gráficas con seguridad y claridad.

## El Concepto Clave: Separación de Responsabilidades

En un ecosistema basado en **Model Context Protocol (MCP)**, es un error muy común confundir la Interfaz Gráfica (UI) con el Servidor o el Host. Para desarrollar aquí, debes grabar esta regla de oro:

> **El Servidor y el Host NO son la aplicación frontend (MCP App).**

Para entenderlo, imagina un restaurante:

1. **El Host (El Cliente/Comensal):** Es el sistema que _inicia_ la petición. Ejemplos de Hosts son la aplicación de escritorio de Claude, Cursor o cualquier LLM que pueda hablar el protocolo MCP. El Host decide qué herramienta llamar, pero no sabe cómo hacer el trabajo duro.
2. **El Servidor MCP (La Cocina):** Es la aplicación backend (normalmente escrita en Node.js, Python, etc.). En nuestro proyecto, esto vive en archivos como `server.ts` o `main.ts`. El servidor expone "Herramientas" (Tools) y "Recursos" al Host.
3. **La Extensión de App / UI (El Menú Interactivo):** Es el **Frontend** construido con React y Vite. Es el código que vamos a explicar en estas guías. Esta UI se renderiza _dentro_ o _a través_ del Host cuando el usuario interactúa con una herramienta que posee una interfaz gráfica asociada.

## Arquitectura de una Extensión UI en MCP

Cuando desarrollas la parte de Extensión UI (`ext-apps`), tu código vive en el mundo del navegador, no en el backend.

### Flujo de Interacción:

1. **Registro:** Al arrancar, nuestro Servidor MCP le dice al Host: _"Oye, tengo una herramienta llamada `get-time` y, por cierto, tiene una interfaz gráfica asociada. Su HTML está en esta ruta."_
2. **Ejecución:** El usuario (o el LLM) en el Host decide usar la herramienta `get-time`.
3. **Renderizado de la UI:** El Host solicita el recurso HTML (nuestra UI en React) y lo pinta en pantalla (por ejemplo, en un iframe o una vista webview segura).
4. **Comunicación Bidireccional:** Nuestra UI en React utiliza un SDK (`@modelcontextprotocol/ext-apps/react`) para "hablar" con el Host. La UI le pide al Host: _"Por favor, dile al Servidor que ejecute la lógica de `get-time` y devuélveme el resultado para que yo lo pinte bonito en pantalla"_.

## El Rol de este Proyecto Frontend

Este proyecto se centra en crear esa "Capa de Presentación". Todo lo que veas dentro de carpetas como `src/` (y en general, lo gestionado por Vite) está destinado a compilarse en una pequeña y eficiente aplicación web de una sola página (SPA).

A lo largo de este proyecto utilizamos:

- **React:** Como librería central para crear componentes interactivos.
- **Vite:** Como nuestro empaquetador ultrarrápido (del cual hablaremos en detalle en la siguiente guía).
- **TailwindCSS y Shadcn UI:** Para dar un estilo moderno y consistente, muy alineado a guías de diseño como las de ChatGPT u OpenAI.

### ¿Dónde vive mi código?

- **`src/`**: Aquí está la magia del Frontend. Encontrarás componentes de UI, vistas de herramientas, etc.
- **`src/shared/`**: Componentes reutilizables de UI (botones, tarjetas, etc.).
- **`src/tools/`**: Aquí encapsularemos la vista de herramientas específicas.
- **`server.ts` / `main.ts`**: ¡Cuidado! Estos archivos son el backend MCP (el servidor). Aunque están en el mismo repositorio para compilar un sistema "Full Stack", pertenecen al lado del servidor.

---

En el siguiente capítulo (**02 - Entorno Vite y Empaquetado**), veremos cómo esta compleja aplicación React se convierte mágicamente en un único archivo HTML listo para ser inyectado en cualquier Host MCP.
