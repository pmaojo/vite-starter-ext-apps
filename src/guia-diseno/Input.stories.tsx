import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/shared/components/ui/input';

/**
 * El componente `Input` permite a los usuarios ingresar texto o datos en formularios.
 *
 * ### Para Diseñadores
 * - Asegúrate de que cada `Input` tenga una etiqueta (Label) clara.
 * - Utiliza el texto de marcador (placeholder) solo para ejemplos breves, no como reemplazo de la etiqueta.
 *
 * ### Para Desarrolladores
 * - Envuelve este componente usando componentes de formulario (como react-hook-form) para la validación del estado.
 * - Soporta todos los tipos nativos de HTML (`type="text"`, `"password"`, `"email"`, etc.).
 */
const meta: Meta<typeof Input> = {
  title: 'Guía de Diseño/Componentes/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'El tipo de entrada HTML.',
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
    },
    placeholder: {
      description: 'Texto de ayuda temporal visible cuando el campo está vacío.',
      control: 'text',
    },
    disabled: {
      description: 'Deshabilita el campo, mostrándolo en gris e impidiendo escritura.',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * **Uso Estándar:** El campo de texto base para nombres, títulos, etc.
 */
export const Estandar: Story = {
  args: {
    type: 'text',
    placeholder: 'Introduce tu nombre...',
  },
};

/**
 * **Contraseñas:** Usa el tipo `password` para ocultar automáticamente los caracteres ingresados por privacidad.
 */
export const Contrasena: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
  },
};

/**
 * **Deshabilitado (Disabled):** Muestra el campo en un estado atenuado para indicar que la edición no está permitida en este momento.
 */
export const Deshabilitado: Story = {
  args: {
    type: 'text',
    placeholder: 'No puedes editar esto',
    disabled: true,
    value: 'Valor de solo lectura',
  },
};
