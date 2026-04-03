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

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Host Bridge Capabilities</h2>
        <p className="text-muted-foreground">
          This tool demonstrates the frontend side effects available via the \`useApp\` SDK hook.
          Use these actions to interact directly with the MCP host.
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
      </div>
    </div>
  );
}
