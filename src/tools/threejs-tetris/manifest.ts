import type { ToolManifest } from "../../core/framework/tool-contract";
import { ThreeJSTetrisTool } from "./ThreeJSTetrisTool";

/**
 * Manifest for the ThreeJS Tetris Tool.
 */
export const threejsTetrisManifest: ToolManifest = {
  slug: "threejs-tetris",
  title: "ThreeJS Tetris",
  description: "Play the classic Tetris game in 3D.",
  version: "1.0.0",
  component: ThreeJSTetrisTool,
};
