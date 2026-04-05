# Guía de Desarrollo: 03 - Desarrollo de UI React y MCP

Ahora que entendemos la arquitectura (Capítulo 01) y cómo se empaqueta nuestra aplicación en un solo archivo HTML (Capítulo 02), es hora de ensuciarnos las manos con el código.

En este capítulo veremos cómo desarrollar la Interfaz Gráfica utilizando React y cómo comunicarnos con el Host MCP.

## El Punto de Entrada y el Hook Mágico: `useApp()`

El corazón de nuestra aplicación frontend reside en el SDK oficial de MCP para React: `@modelcontextprotocol/ext-apps/react`.

La regla más importante al desarrollar aquí es **no intentar gestionar la conexión MCP manualmente**. El SDK proporciona un Hook de React que hace todo el trabajo pesado por nosotros: `useApp()`.

### ¿Qué hace `useApp()`?

Este hook establece y mantiene automáticamente la conexión bidireccional entre tu UI (el iframe/webview) y el Host MCP.

```tsx
import React, { useState } from "react";
import { useApp } from "@modelcontextprotocol/ext-apps/react";

export function MiHerramientaUI() {
  // Inicializamos la conexión con el Host
  const { isConnected, context, callServerTool } = useApp();

  // Siempre es buena práctica mostrar un estado de carga mientras se conecta
  if (!isConnected) {
    return <div>Conectando con el Host MCP...</div>;
  }

  return (
    <div>
      <h1>¡Conectado exitosamente!</h1>
      {/* El contexto contiene información que el Host nos pasa al iniciar */}
      <p>Herramienta solicitada: {context.toolName}</p>
    </div>
  );
}
```

### El Contexto (`context`)

El `context` es fundamental. Cuando el Host renderiza nuestra aplicación, inyecta un contexto inicial. Por ejemplo, incluye el `toolName` (el nombre de la herramienta que el usuario quiere usar). Basándonos en ese `toolName`, nuestra aplicación principal de React puede decidir qué componente de herramienta renderizar en pantalla (enrutamiento dinámico).

### Llamando al Servidor: `callServerTool`

Recuerda: la UI no hace el trabajo pesado. Si la UI necesita datos de una base de datos o ejecutar un script complejo, debe pedírselo al Servidor Backend MCP. Lo hacemos a través del Host utilizando `callServerTool`.

```tsx
const manejarClick = async () => {
  try {
    // Le pedimos al Host que llame a una herramienta en el Servidor
    const resultado = await callServerTool("obtener_datos_cliente", {
      id: 123,
    });
    console.log("El servidor respondió:", resultado);
  } catch (error) {
    console.error("Error al ejecutar la herramienta", error);
  }
};
```

## Creando Componentes e Interfaz

Todo el desarrollo de la interfaz se realiza dentro de la carpeta `src/`.

### 1. Estructura de "Micro-Manifest" para Herramientas

Para mantener el código organizado y escalable, utilizamos una arquitectura donde cada herramienta es un módulo independiente (dentro de `src/tools/`).

Evita usar `React.lazy()` o importaciones dinámicas para cargar estas herramientas en el registro principal, ya que queremos que el tipado de TypeScript (IntelliSense) sea estricto y seguro en tiempo de compilación.

### 2. Shadcn UI y TailwindCSS

Nuestra aplicación está estilizada para tener un aspecto moderno y profesional, alineado con estándares de diseño como los de OpenAI/ChatGPT.

Para lograr esto usamos **TailwindCSS** para estilos utilitarios y **Shadcn UI** para componentes accesibles.

**Importante:** Nunca crees componentes base (como botones, inputs, o modales) desde cero si no es necesario.
Si necesitas un componente nuevo, usa la CLI de Shadcn. Por ejemplo:

```bash
npx shadcn@latest add dialog
```

Esto descargará el código del componente a `src/components/ui/` (o la ruta configurada) donde podrás personalizarlo.

### 3. Notificaciones y Logs Visuales

En aplicaciones de herramientas, es vital mantener al usuario informado de lo que está sucediendo. Implementamos un sistema de "Logs visuales". En lugar de hacer `console.log()` que el usuario nunca verá, utiliza componentes de notificaciones (Toasts, como Sonner, si está integrado) para mostrar éxitos o errores durante las llamadas a `callServerTool`.

### 4. Internacionalización (i18n)

La aplicación soporta (o está preparada para soportar) múltiples idiomas. Cuando desarrolles nuevos textos en la interfaz, evita "quemarlos" en el código duro (hardcoding). Utiliza las librerías de i18n configuradas en el proyecto (ej. `react-i18next`) cargando los textos desde archivos JSON de traducción.

---

## Resumen de Buenas Prácticas

1. **Usa `useApp()`:** Es tu única vía de comunicación autorizada con el ecosistema MCP.
2. **Delega al Backend:** Tu UI solo debe mostrar datos y capturar intenciones del usuario. La lógica de negocio real vive en el backend.
3. **Usa la CLI de Shadcn:** Mantén el diseño coherente y ahorra tiempo.
4. **Piensa en "Single File":** Recuerda que todo esto terminará empaquetado en un solo HTML inmenso. Evita importar recursos estáticos gigantes (como imágenes pesadas locales) a menos que sea estrictamente necesario, ya que aumentarán dramáticamente el tamaño de carga de la UI. Usa URLs externas para recursos pesados si es posible.

¡Felicidades! Estás listo para comenzar a crear interfaces increíbles para Model Context Protocol.
