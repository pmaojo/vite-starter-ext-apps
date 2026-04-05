import { describe, it, expect } from "vitest";
import { TOOL_COMPONENTS } from "./registry";

describe("registry", () => {
  it("should have tool components registered", () => {
    expect(Object.keys(TOOL_COMPONENTS).length).toBeGreaterThan(0);
    expect(TOOL_COMPONENTS["get-time"]).toBeDefined();
    expect(TOOL_COMPONENTS["host-bridge"]).toBeDefined();
    expect(TOOL_COMPONENTS["list-files"]).toBeDefined();
    expect(TOOL_COMPONENTS["learn-mcp"]).toBeDefined();
    expect(TOOL_COMPONENTS["threejs-tetris"]).toBeDefined();
  });
});
