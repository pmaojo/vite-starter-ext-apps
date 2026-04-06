import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/shared/components/ui/button";

/**
 * El componente `Button` es el principal llamado a la acción (Call to Action) en la interfaz.
 *
 * ### Cuándo usar
 * - Para enviar un formulario.
 * - Para iniciar una acción importante (Guardar, Eliminar, Aceptar).
 * - Para navegar a otra página importante (usado como "link" variant).
 *
 * ### Cuándo NO usar
 * - Para navegación de texto simple dentro de un párrafo (usa etiquetas `<a>`).
 */
const meta: Meta<typeof Button> = {
  title: "Guía de Diseño/Componentes/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description: "El estilo visual del botón, que comunica su propósito.",
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: {
      description: "El tamaño del botón.",
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      description:
        "Deshabilita el botón, impidiendo la interacción del usuario.",
      control: "boolean",
    },
    children: {
      description: "El contenido interno del botón (texto o iconos).",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * **Primario (Default):** Utilizado para la acción más importante en la pantalla.
 * Debería haber, idealmente, solo un botón primario por vista para evitar confusión.
 */
export const Primario: Story = {
  args: {
    variant: "default",
    children: "Guardar Cambios",
  },
};

/**
 * **Secundario:** Para acciones alternativas de menor prioridad que el botón primario.
 * Suele acompañar a un botón primario (ej. "Cancelar" al lado de "Guardar").
 */
export const Secundario: Story = {
  args: {
    variant: "secondary",
    children: "Cancelar",
  },
};

/**
 * **Destructivo:** Advierte al usuario que la acción es peligrosa y no se puede deshacer (ej. eliminar un archivo, borrar cuenta).
 * Siempre usa este color (generalmente rojo) para acciones de borrado o rechazo extremo.
 */
export const Destructivo: Story = {
  args: {
    variant: "destructive",
    children: "Eliminar Cuenta",
  },
};

/**
 * **Contorno (Outline):** Útil para acciones secundarias donde el botón secundario sólido tiene demasiado peso visual.
 */
export const Contorno: Story = {
  args: {
    variant: "outline",
    children: "Exportar CSV",
  },
};

/**
 * **Fantasma (Ghost):** Usado para acciones terciarias. No tiene bordes ni fondo hasta que el usuario pasa el ratón por encima. Excelente para barras de herramientas.
 */
export const Fantasma: Story = {
  args: {
    variant: "ghost",
    children: "Copiar enlace",
  },
};
