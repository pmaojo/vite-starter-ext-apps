import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { McpProvider, useMcp } from "./McpProvider";
import * as mcpReact from "@modelcontextprotocol/ext-apps/react";
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";

vi.mock("@modelcontextprotocol/ext-apps/react", () => ({
  useApp: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function TestComponent() {
  const { app, error, hostContext } = useMcp();
  if (error) return <div>Error: {error.message}</div>;
  if (!app) return <div>No app</div>;
  return (
    <div>
      <div>App initialized</div>
      {hostContext && <div>Host: {hostContext.appInfo.name}</div>}
    </div>
  );
}

describe("McpProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("should render and provide useMcp context with error", () => {
    vi.mocked(mcpReact.useApp).mockReturnValue({
      app: null,
      error: new Error("Test error"),
    });

    render(
      <McpProvider>
        <TestComponent />
      </McpProvider>
    );

    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });

  it("should render and provide useMcp context with initialized app", () => {
    const mockApp = {
      getHostContext: () => ({ appInfo: { name: "TestHost" } }) as unknown as McpUiHostContext,
    } as unknown as App;

    vi.mocked(mcpReact.useApp).mockReturnValue({
      app: mockApp,
      error: null,
    });

    render(
      <McpProvider>
        <TestComponent />
      </McpProvider>
    );

    expect(screen.getByText("App initialized")).toBeInTheDocument();
  });

  it("throws when useMcp is used outside provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow("useMcp must be used within an McpProvider");
    consoleError.mockRestore();
  });
});
