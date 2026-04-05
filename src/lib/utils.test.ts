import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("should merge tailwind classes properly", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });

  it("should conditionally apply classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("base-class", isTrue && "true-class", isFalse && "false-class")).toBe("base-class true-class");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["class-a", "class-b"], "class-c")).toBe("class-a class-b class-c");
  });

  it("should handle objects of classes", () => {
    expect(cn({ "class-a": true, "class-b": false }, "class-c")).toBe("class-a class-c");
  });
});
