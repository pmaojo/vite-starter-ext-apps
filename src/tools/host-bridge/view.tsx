import type { ToolComponentProps } from "@/core/framework/tool-contract";
import { ActionCard } from "@/shared/components/ui/action-card";
import { toast } from "sonner";

export function HostBridgeView({ app }: ToolComponentProps) {

  const handleSendMessage = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      await app.sendMessage({
        role: "user",
        content: [{ type: "text", text: "Hello from the Host Bridge tool! Task completed successfully." }]
      });
      toast.success("Message sent to host.");
    } catch (e: any) {
      toast.error(`Failed to send message: ${e.message}`);
    }
  };

  const handleSendLog = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      await app.sendLog({
        level: "info",
        logger: "host-bridge",
        data: `Hydration complete at ${new Date().toISOString()}`
      });
      toast.success("Log sent to host.");
    } catch (e: any) {
      toast.error(`Failed to send log: ${e.message}`);
    }
  };

  const handleOpenLink = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      // Opening a generic helpful link, maybe the MCP docs
      await app.openLink({ url: "https://modelcontextprotocol.io/docs" });
      toast.success("Requested host to open link.");
    } catch (e: any) {
      toast.error(`Failed to open link: ${e.message}`);
    }
  };

  /**
   * Demonstrates the MCP Apps SDK downloadFile capability.
   * This is a didactic example for demo purposes.
   */
  const handleDownloadFile = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      const data = JSON.stringify({ message: "Hello from MCP App!" }, null, 2);
      const { isError } = await app.downloadFile({
        contents: [{
          type: "resource",
          resource: {
            uri: "file:///demo-export.json",
            mimeType: "application/json",
            text: data,
          },
        }],
      });
      if (isError) {
        toast.warning("Download denied or cancelled by host.");
      } else {
        toast.success("Requested host to download file.");
      }
    } catch (e: any) {
      toast.error(`Failed to download file: ${e.message}`);
    }
  };

  /**
   * Demonstrates the MCP Apps SDK requestTeardown capability.
   * This is a didactic example for demo purposes.
   */
  const handleRequestTeardown = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      await app.requestTeardown();
      toast.success("Requested host to teardown app.");
    } catch (e: any) {
      toast.error(`Failed to request teardown: ${e.message}`);
    }
  };

  /**
   * Demonstrates the MCP Apps SDK requestDisplayMode capability.
   * This is a didactic example for demo purposes.
   */
  const handleRequestDisplayMode = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      const ctx = app.getHostContext();
      const currentMode = ctx?.displayMode || "inline";
      const newMode = currentMode === "inline" ? "fullscreen" : "inline";

      const result = await app.requestDisplayMode({ mode: newMode });
      toast.success(`Requested display mode change to ${result.mode}.`);
    } catch (e: any) {
      toast.error(`Failed to request display mode change: ${e.message}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Host Bridge Capabilities</h2>
        <p className="text-muted-foreground">
          This tool demonstrates the frontend side effects available via the \`useApp\` SDK hook.
          Use these actions to interact directly with the MCP host. Note: These tools are for demo purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="Signal Host"
          description="Send a message back to the AI context. This inserts text directly into the conversation."
          buttonText="Send Message"
          onAction={handleSendMessage}
        />
        <ActionCard
          title="System Log"
          description="Push a debug trace to the host console. Useful for debugging without disturbing the chat."
          buttonText="Send Log"
          onAction={handleSendLog}
        />
        <ActionCard
          title="Open Link"
          description="Request the host to open a URL in the default browser. Opens MCP Documentation."
          buttonText="Open Link"
          onAction={handleOpenLink}
        />
        <ActionCard
          title="Download File"
          description="Request the host to download a file. Generates a demo JSON export."
          buttonText="Download File"
          onAction={handleDownloadFile}
        />
        <ActionCard
          title="Request Teardown"
          description="Request the host to gracefully close and teardown this app instance."
          buttonText="Teardown App"
          onAction={handleRequestTeardown}
        />
        <ActionCard
          title="Toggle Display Mode"
          description="Request the host to switch between inline and fullscreen display modes."
          buttonText="Toggle Mode"
          onAction={handleRequestDisplayMode}
        />
      </div>
    </div>
  );
}
