import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
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

vi.mock("./logger", () => ({
  logger: {
    setApp: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }
}));

function TestComponent() {
  const { app, error, hostContext, toolResult } = useMcp();
  return (
    <div>
      <div data-testid="tool-result">{toolResult ? "has result" : "no result"}</div>
    </div>
  );
}

describe("McpProvider callbacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("registers callbacks properly and handles them", () => {
    let appCallbacks: any = {};
    const mockApp = {
      getHostContext: () => ({ appInfo: { name: "TestHost" } }) as unknown as McpUiHostContext,
      set onteardown(cb: any) { appCallbacks.onteardown = cb; },
      set ontoolinput(cb: any) { appCallbacks.ontoolinput = cb; },
      set ontoolresult(cb: any) { appCallbacks.ontoolresult = cb; },
      set ontoolcancelled(cb: any) { appCallbacks.ontoolcancelled = cb; },
      set onerror(cb: any) { appCallbacks.onerror = cb; },
      set onhostcontextchanged(cb: any) { appCallbacks.onhostcontextchanged = cb; },
    } as unknown as App;

    vi.mocked(mcpReact.useApp).mockImplementation((opts) => {
      opts.onAppCreated?.(mockApp);
      return {
        app: mockApp,
        error: null,
      };
    });

    render(
      <McpProvider>
        <TestComponent />
      </McpProvider>
    );

    // Call callbacks
    act(() => {
      appCallbacks.onteardown();
      appCallbacks.ontoolinput({ input: "test" });
      appCallbacks.ontoolcancelled({ reason: "test reason" });
      appCallbacks.onerror(new Error("test error"));
      appCallbacks.onhostcontextchanged();
      appCallbacks.ontoolresult({ result: "test" });
    });

    expect(screen.getByTestId("tool-result").textContent).toBe("has result");
  });
});
