import type { ToolManifest } from "../../core/framework/tool-contract";
import { PrinceJS } from "./PrinceJS";

/**
 * Manifest for the PrinceJS Tool.
 */
export const princeJsManifest: ToolManifest = {
  slug: "prince-js",
  title: "PrinceJS",
  description: "Play the classic Prince of Persia game.",
  version: "1.0.0",
  component: PrinceJS,
};
