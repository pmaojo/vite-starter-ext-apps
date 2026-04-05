import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppContent } from "./mcp-app";
import { useMcp } from "./core/mcp/McpProvider";

import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";

vi.mock("./core/mcp/McpProvider", () => ({
  useMcp: vi.fn(),
  McpProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-i18next", async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string, options?: Record<string, unknown>) => {
      if (options && options.toolName) return `${key} ${options.toolName}`;
      return key;
    }}),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    }
  };
});

vi.mock("./tools/registry", () => ({
  TOOL_COMPONENTS: {
    "test-tool": () => <div data-testid="test-tool">Test Tool Component</div>,
  },
}));

describe("AppContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render error state", () => {
    vi.mocked(useMcp).mockReturnValue({
      error: new Error("Connection failed"),
      app: null,
      hostContext: undefined,
      toolResult: null,
    });

    render(<AppContent />);
    expect(screen.getByText("app.error")).toBeInTheDocument();
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });

  it("should render connecting state", () => {
    vi.mocked(useMcp).mockReturnValue({
      error: null,
      app: null,
      hostContext: undefined,
      toolResult: null,
    });

    render(<AppContent />);
    expect(screen.getByText("app.connecting")).toBeInTheDocument();
  });

  it("should render no tool context state", () => {
    vi.mocked(useMcp).mockReturnValue({
      error: null,
      app: {} as App,
      hostContext: undefined,
      toolResult: null,
    });

    render(<AppContent />);
    expect(screen.getByText("app.noToolContext")).toBeInTheDocument();
  });

  it("should render tool not found state", () => {
    vi.mocked(useMcp).mockReturnValue({
      error: null,
      app: {} as App,
      hostContext: {
        toolInfo: {
          tool: { name: "unknown-tool" }
        }
      } as unknown as McpUiHostContext,
      toolResult: null,
    });

    render(<AppContent />);
    expect(screen.getByText("app.toolNotFound unknown-tool")).toBeInTheDocument();
  });

  it("should render actual tool component", () => {
    vi.mocked(useMcp).mockReturnValue({
      error: null,
      app: {} as App,
      hostContext: {
        toolInfo: {
          tool: { name: "test-tool" }
        }
      } as unknown as McpUiHostContext,
      toolResult: null,
    });

    render(<AppContent />);
    expect(screen.getByTestId("test-tool")).toBeInTheDocument();
  });
});
