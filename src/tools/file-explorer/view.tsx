import { useState, useEffect, useCallback } from "react";
import type { ToolComponentProps } from "@/core/framework/tool-contract";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import File from "lucide-react/dist/esm/icons/file";
import Folder from "lucide-react/dist/esm/icons/folder";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema matching the server response
const FileEntrySchema = z.object({
  name: z.string(),
  isDirectory: z.boolean(),
  path: z.string(),
});
type FileEntry = z.infer<typeof FileEntrySchema>;

const ListFilesResponseSchema = z.array(FileEntrySchema);

/**
 * File Explorer Tool View.
 *
 * @description
 * This React component demonstrates advanced frontend-to-backend communication
 * through the MCP Apps SDK. It acts as the interactive UI for the `list-files` tool.
 *
 * Architectural Focus:
 * - **`callServerTool` API:** Demonstrates how the frontend can asynchronously invoke
 *   server-side logic bypassing standard HTTP fetches, relying entirely on the MCP bridge.
 * - **Zod Integration:** Notice the usage of `ListFilesResponseSchema.parse()`. Since
 *   the transport layer (MCP) returns dynamic payloads, validating the shape of the
 *   response on the client side using Zod ensures strict type safety and prevents silent UI failures.
 * - **Shadcn UI:** Uses standard enterprise-grade components (`Card`, `Button`) from
 *   the `@/shared/components` directory.
 *
 * Note: This is a didactic implementation created for demo purposes to illustrate
 * secure, sandboxed directory browsing over MCP.
 *
 * @param {ToolComponentProps} props - The standard props injected by the App router.
 */
export function FileExplorerView({ app }: ToolComponentProps) {
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches directory contents from the backend.
   * Demonstrates the `callServerTool` SDK capability.
   */
  const fetchFiles = useCallback(async (subpath: string) => {
    if (!app) return;
    setIsLoading(true);
    setError(null);
    try {
      // Type-safe call to the backend
      const result = await app.callServerTool({
        name: "list-files",
        arguments: { subpath },
      });

      if (result.isError) {
        const errorText = result.content?.find((c) => c.type === "text") as { type: "text", text: string } | undefined;
        throw new Error(errorText?.text || "Unknown server error");
      }

      const textContent = result.content?.find((c) => c.type === "text") as { type: "text", text: string } | undefined;
      if (!textContent) throw new Error("No content returned from server");

      const parsedData = JSON.parse(textContent.text);
      const validatedFiles = ListFilesResponseSchema.parse(parsedData);

      setFiles(validatedFiles);
      setCurrentPath(subpath);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch files");
      toast.error("Failed to load directory");
    } finally {
      setIsLoading(false);
    }
  }, [app]);

  // Initial fetch
  useEffect(() => {
    if (app) {
      fetchFiles("");
    }
  }, [app, fetchFiles]);

  const handleNavigate = (entry: FileEntry) => {
    if (entry.isDirectory) {
      fetchFiles(entry.path);
    } else {
      toast.info(`Cannot navigate into file: ${entry.name}`);
    }
  };

  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split("/");
    parts.pop();
    fetchFiles(parts.join("/"));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sandbox Explorer</CardTitle>
          <CardDescription>
            Securely browse the mcp-sandbox directory
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchFiles(currentPath)}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Breadcrumb / Path Display */}
        <div className="flex items-center space-x-2 mb-4 p-2 bg-muted/50 rounded-md text-sm font-mono text-muted-foreground overflow-x-auto">
          <button
            onClick={() => fetchFiles("")}
            className="hover:text-foreground hover:underline whitespace-nowrap"
          >
            sandbox
          </button>
          {currentPath
            .split("/")
            .filter(Boolean)
            .map((part, idx, arr) => (
              <div key={idx} className="flex items-center whitespace-nowrap">
                <ChevronRight className="h-4 w-4 mx-1" />
                <button
                  onClick={() => fetchFiles(arr.slice(0, idx + 1).join("/"))}
                  className="hover:text-foreground hover:underline"
                >
                  {part}
                </button>
              </div>
            ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center text-destructive p-4 border border-destructive/20 rounded-md mb-4 bg-destructive/10">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* File List */}
        <div className="border rounded-md divide-y overflow-hidden">
          {currentPath && (
            <button
              onClick={handleNavigateUp}
              className="w-full flex items-center p-3 hover:bg-muted/50 transition-colors text-sm text-left"
            >
              <Folder className="h-4 w-4 mr-3 text-muted-foreground" />
              ..
            </button>
          )}

          {isLoading && files.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Loading...
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              This directory is empty.
            </div>
          ) : (
            files.map((file) => (
              <button
                key={file.path}
                onClick={() => handleNavigate(file)}
                className={`w-full flex items-center p-3 hover:bg-muted/50 transition-colors text-sm text-left ${!file.isDirectory && "cursor-default hover:bg-transparent"}`}
              >
                {file.isDirectory ? (
                  <Folder className="h-4 w-4 mr-3 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 mr-3 text-muted-foreground" />
                )}
                <span className="font-medium">{file.name}</span>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
