import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

/**
 * El componente `Card` se utiliza para agrupar información relacionada de manera visualmente contenida.
 *
 * ### Estructura
 * Una Tarjeta típicamente se compone de:
 * - **Header:** Para el título principal.
 * - **Content:** Para el cuerpo o texto principal de la tarjeta.
 * - **Footer:** Para acciones asociadas a la tarjeta (Botones).
 *
 * ### Buenas Prácticas
 * - No sobrecargues una tarjeta con demasiada información; manténla enfocada a un solo concepto.
 */
const meta: Meta<typeof Card> = {
  title: "Guía de Diseño/Componentes/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * **Tarjeta Completa:** Una tarjeta con título, descripción, contenido y botones de acción en el pie.
 */
export const TarjetaCompleta: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Crear Proyecto</CardTitle>
        <CardDescription>
          Despliega tu nuevo proyecto con un solo clic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Esta es la sección de contenido donde normalmente colocarías
          información detallada o pequeños formularios.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button>Desplegar</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * **Tarjeta Simple:** Solo usando el contenedor básico para mostrar una pieza de información destacada.
 */
export const TarjetaSimple: Story = {
  render: () => (
    <Card className="w-[350px] p-6 text-center">
      <h3 className="text-lg font-semibold">Métrica Importante</h3>
      <p className="text-4xl font-bold mt-4 text-primary">85%</p>
    </Card>
  ),
};
