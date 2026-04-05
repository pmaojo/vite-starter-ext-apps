import type { Meta, StoryObj } from "@storybook/react";
import { TOOL_COMPONENTS } from "../tools/registry";

// Types to mock what the actual MCP Host provides
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * **Tools Sandbox**
 *
 * Este sandbox simula un entorno "Host" (como ChatGPT) donde nuestras herramientas MCP
 * se renderizan. Utiliza el `TOOL_COMPONENTS` de nuestro registro central para montar
 * dinámicamente el componente correcto basado en la selección.
 *
 * Es fundamental probar nuestras herramientas aquí proporcionando un \`mockApp\` falso
 * y resultados simulados para asegurar que los componentes sean robustos frente
 * a la asincronía y al contexto del host.
 */
const ToolsSandbox = ({
  selectedToolSlug,
  mockToolResult,
}: {
  selectedToolSlug: string;
  mockToolResult: string;
}) => {
  const SelectedComponent = TOOL_COMPONENTS[selectedToolSlug];

  if (!SelectedComponent) {
    return (
      <div className="p-4 text-destructive border border-destructive bg-destructive/10 rounded-md">
        Error: No component registered for tool slug "{selectedToolSlug}"
      </div>
    );
  }

  // Crea un entorno de "Host" simulado.
  const mockApp = {
    // Simulamos la API del App de @modelcontextprotocol/ext-apps
    sendMessage: (msg: string) =>
      alert(`[Mock App] Sending message to host: ${msg}`),
    // ... más métodos podrían añadirse si las herramientas los necesitan
  } as unknown as App;

  // Parsea el mockToolResult de un string (del control de Storybook) a un objeto CallToolResult real.
  let parsedToolResult: CallToolResult | null = null;
  try {
    if (mockToolResult) {
      parsedToolResult = JSON.parse(mockToolResult) as CallToolResult;
    }
  } catch (e) {
    console.error("Failed to parse mockToolResult JSON", e);
    // Fallback a un error visual si el JSON es inválido
    parsedToolResult = {
      content: [{ type: "text", text: `[JSON Parse Error]: ${e}` }],
      isError: true,
    };
  }

  const mockHostContext: McpUiHostContext = {
    toolName: selectedToolSlug,
    // Add other mocked context values if needed
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground">
        <p>
          <strong>Host Environment:</strong> Storybook Sandbox
        </p>
        <p>
          <strong>Mounted Tool:</strong> {selectedToolSlug}
        </p>
      </div>

      <div className="border border-dashed p-6 rounded-xl relative">
        <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Rendered Tool UI
        </div>

        <SelectedComponent
          app={mockApp}
          toolResult={parsedToolResult}
          hostContext={mockHostContext}
        />
      </div>
    </div>
  );
};

const meta = {
  title: "Guía de Diseño/Herramientas (Tools)/Sandbox Host",
  component: ToolsSandbox,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    selectedToolSlug: {
      control: "select",
      options: Object.keys(TOOL_COMPONENTS),
      description: "El slug (toolName) de la herramienta a renderizar.",
    },
    mockToolResult: {
      control: "text",
      description:
        "JSON representando el CallToolResult devuelto por el servidor.",
    },
  },
} satisfies Meta<typeof ToolsSandbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Extraemos las claves disponibles para crear historias por defecto útiles
const availableTools = Object.keys(TOOL_COMPONENTS);
const firstTool = availableTools.length > 0 ? availableTools[0] : "";

export const Default: Story = {
  args: {
    selectedToolSlug: firstTool,
    mockToolResult: JSON.stringify(
      {
        content: [{ type: "text", text: "Mock data from server execution." }],
      },
      null,
      2
    ),
  },
};

export const LearnMcpExample: Story = {
  args: {
    selectedToolSlug: "learn-mcp",
    mockToolResult: JSON.stringify(
      {
        content: [
          {
            type: "text",
            text: "Mock learn data",
          },
        ],
      },
      null,
      2
    ),
  },
};

// Si 'get-time' existe en el registro, proporcionamos una historia específica para él.
export const GetTimeExample: Story = {
  args: {
    selectedToolSlug: "get-time",
    mockToolResult: JSON.stringify(
      {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              currentTime: new Date().toISOString(),
              timezone: "UTC",
            }),
          },
        ],
      },
      null,
      2
    ),
  },
};
