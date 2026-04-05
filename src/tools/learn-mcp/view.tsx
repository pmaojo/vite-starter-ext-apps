import React, { useState, useEffect } from "react";
import type { ToolComponentProps } from "@/core/framework/tool-contract";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { InlineCard } from "@/shared/components/ui/inline-card";
import { FullscreenView } from "@/shared/components/ui/fullscreen-view";
import { toast } from "sonner";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2";
import Award from "lucide-react/dist/esm/icons/award";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Star from "lucide-react/dist/esm/icons/star";
import { DataFlowDiagram } from "./components/data-flow-diagram";

// Data Models
interface Module {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  points: number;
  badgeId?: string;
}

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const BADGES: Record<string, BadgeDef> = {
  starter: {
    id: "starter",
    name: "Apprentice",
    description: "Started the journey",
    icon: <Star className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  builder: {
    id: "builder",
    name: "UI Builder",
    description: "Learned MCP UI",
    icon: <Award className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  architect: {
    id: "architect",
    name: "Systems Architect",
    description: "Understands MCP Architecture",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  master: {
    id: "master",
    name: "SDK Master",
    description: "Completed all modules",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

const MODULES: Module[] = [
  {
    id: "intro",
    title: "Introduction to MCP Ext-Apps",
    description: "Learn the basics of the Model Context Protocol Apps SDK.",
    points: 10,
    badgeId: "starter",
    content: (
      <div className="space-y-4">
        <p>
          The <strong>@modelcontextprotocol/ext-apps</strong> package enables
          developers to build interactive, UI-driven tools that integrate with
          AI assistants.
        </p>
        <p>
          Unlike raw JSON tools, MCP Apps provide a rich React frontend
          alongside a backend server component.
        </p>
        <h3 className="text-lg font-semibold mt-4">Key Concepts</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Host</strong>: The AI client running the LLM.
          </li>
          <li>
            <strong>App / Tool</strong>: The code you write to execute logic and
            present UI.
          </li>
          <li>
            <strong>Context</strong>: Data passed from the host to the app.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "architecture",
    title: "Architecture Data Flow",
    description: "Understand how data flows between the Host, App, and Server.",
    points: 15,
    badgeId: "architect",
    content: (
      <div className="space-y-4">
        <p>
          The architecture of an MCP App involves three main components
          interacting with each other.
        </p>
        <DataFlowDiagram />
        <h3 className="text-lg font-semibold mt-4">Interactions</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The <strong>Host</strong> runs the MCP Server and renders the{" "}
            <strong>App's UI</strong>.
          </li>
          <li>
            The <strong>App</strong> communicates with the <strong>Host</strong>{" "}
            via the SDK (e.g., <code>sendMessage</code>).
          </li>
          <li>
            The <strong>App</strong> can also call <strong>Server Tools</strong>{" "}
            via the SDK's <code>callServerTool</code> method, proxying through
            the Host.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "ui",
    title: "Building UI Resources",
    description: "Understand how React UIs are served and rendered.",
    points: 20,
    badgeId: "builder",
    content: (
      <div className="space-y-4">
        <p>
          MCP tools with UIs expose an HTML resource. When an LLM calls a tool
          configured with a UI, the host renders that HTML in a secure iframe or
          webview.
        </p>
        <p>
          In this repository, we use Vite with a single-file plugin to bundle
          the React application into <code>mcp-app.html</code>.
        </p>
        <h3 className="text-lg font-semibold mt-4">The useApp() Hook</h3>
        <p>
          Your React components must use the <code>useApp()</code> hook from the
          SDK to communicate with the host. It handles the handshake and
          provides methods like <code>callServerTool</code> and{" "}
          <code>sendMessage</code>.
        </p>
      </div>
    ),
  },
  {
    id: "server",
    title: "Server Integrations",
    description:
      "Registering tools and handling requests on the Node.js backend.",
    points: 20,
    badgeId: "master",
    content: (
      <div className="space-y-4">
        <p>
          The backend (<code>server.ts</code>) registers tools using{" "}
          <code>registerAppTool</code> from{" "}
          <code>@modelcontextprotocol/ext-apps/server</code>.
        </p>
        <h3 className="text-lg font-semibold mt-4">UI Metadata</h3>
        <p>
          You link a backend tool to a frontend UI by providing{" "}
          <code>_meta.ui.resourceUri</code> in the tool registration schema.
        </p>
        <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-x-auto">
          {`registerAppTool(server, "my-tool", {
  title: "My Tool",
  inputSchema: z.object({}),
  _meta: { ui: { resourceUri: "ui://my-app/index.html" } }
}, handler);`}
        </pre>
      </div>
    ),
  },
];

interface LearnMcpProgress {
  points: number;
  completedModules: string[];
  earnedBadges: string[];
}

function loadSavedProgress(): LearnMcpProgress {
  try {
    const saved = localStorage.getItem("learnMcpState:v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        points: parsed.points || 0,
        completedModules: parsed.completedModules || [],
        earnedBadges: parsed.earnedBadges || [],
      };
    }
  } catch {
    // ignore
  }
  return { points: 0, completedModules: [], earnedBadges: [] };
}

export function LearnMcpView({}: ToolComponentProps) {
  // Load all progress state from a single localStorage read
  const [{ points, completedModules, earnedBadges }, setProgress] = useState<LearnMcpProgress>(loadSavedProgress);

  const setPoints = (updater: number | ((prev: number) => number)) =>
    setProgress((prev) => ({
      ...prev,
      points: typeof updater === "function" ? updater(prev.points) : updater,
    }));

  const setCompletedModules = (updater: string[] | ((prev: string[]) => string[])) =>
    setProgress((prev) => ({
      ...prev,
      completedModules: typeof updater === "function" ? updater(prev.completedModules) : updater,
    }));

  const setEarnedBadges = (updater: string[] | ((prev: string[]) => string[])) =>
    setProgress((prev) => ({
      ...prev,
      earnedBadges: typeof updater === "function" ? updater(prev.earnedBadges) : updater,
    }));

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Save state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "learnMcpState:v1",
        JSON.stringify({ points, completedModules, earnedBadges })
      );
    } catch {
      // ignore — localStorage may be unavailable (e.g. private browsing, quota exceeded)
    }
  }, [points, completedModules, earnedBadges]);

  const totalPossiblePoints = MODULES.reduce((sum, m) => sum + m.points, 0);
  const progressPercent =
    totalPossiblePoints > 0
      ? Math.round((points / totalPossiblePoints) * 100)
      : 0;

  const handleCompleteModule = (module: Module) => {
    if (!completedModules.includes(module.id)) {
      setCompletedModules((prev: string[]) => [...prev, module.id]);
      setPoints((prev: number) => prev + module.points);

      toast.success(
        `Completed "${module.title}"! Earned ${module.points} points.`
      );

      if (module.badgeId && !earnedBadges.includes(module.badgeId)) {
        setEarnedBadges((prev: string[]) => [...prev, module.badgeId!]);
        const badgeDef = BADGES[module.badgeId!];
        toast(`New Badge Earned: ${badgeDef?.name || module.badgeId}`, {
          icon: <Award className="w-5 h-5 text-yellow-500" />,
        });
      }
    }
    setActiveModuleId(null);
  };

  const handleReset = () => {
    setProgress({ points: 0, completedModules: [], earnedBadges: [] });
    setActiveModuleId(null);
    localStorage.removeItem("learnMcpState:v1");
    toast.info("Progress reset.");
  };

  const activeModule = MODULES.find((m) => m.id === activeModuleId);

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background text-foreground animate-in fade-in duration-300 pb-4">
      {/* Header & Stats Container */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Learn MCP
          </h2>
          <div className="flex items-center gap-2 font-mono text-sm bg-muted px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500" />
            {points} pts
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2.5 mb-1 overflow-hidden">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>
            {progressPercent}% ({points}/{totalPossiblePoints})
          </span>
        </div>
      </div>

      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
            Achievements
          </h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((bId) => {
              const b = BADGES[bId];
              if (!b) return null;
              return (
                <Badge
                  key={bId}
                  variant="outline"
                  className={`${b.color} pl-1 gap-1.5`}
                >
                  {b.icon}
                  {b.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Modules List (Mobile First - Stacked Cards) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {MODULES.map((module) => {
          const isCompleted = completedModules.includes(module.id);
          return (
            <InlineCard
              key={module.id}
              title={module.title}
              className={`w-full max-w-full transition-all ${isCompleted ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"}`}
              primaryActions={
                <Button
                  size="sm"
                  variant={isCompleted ? "secondary" : "default"}
                  onClick={() => setActiveModuleId(module.id)}
                >
                  {isCompleted ? "Review" : "Start"}
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground mb-3">
                {module.description}
              </p>
              <div className="flex items-center justify-between text-xs mt-auto">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-3 h-3" /> {module.points} points
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
            </InlineCard>
          );
        })}
      </div>

      {/* Reset Button */}
      <div className="px-4 mt-auto pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground text-xs"
          onClick={handleReset}
        >
          Reset Progress
        </Button>
      </div>

      {/* Fullscreen Module View */}
      {activeModule && (
        <FullscreenView
          title={activeModule.title}
          onClose={() => setActiveModuleId(null)}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            {activeModule.content}
          </div>

          <div className="mt-8 flex flex-col items-center border-t pt-6 gap-4">
            <div className="flex items-center gap-2 mb-2 text-lg font-medium">
              Earn <Star className="w-5 h-5 text-yellow-500" />{" "}
              {activeModule.points} points
              {activeModule.badgeId && BADGES[activeModule.badgeId] && (
                <>
                  <span className="text-muted-foreground px-2">+</span>
                  <Badge
                    variant="outline"
                    className={BADGES[activeModule.badgeId].color}
                  >
                    {BADGES[activeModule.badgeId].icon}{" "}
                    <span className="ml-1">
                      {BADGES[activeModule.badgeId].name}
                    </span>
                  </Badge>
                </>
              )}
            </div>
            <Button
              size="lg"
              className="w-full max-w-xs"
              onClick={() => handleCompleteModule(activeModule)}
              disabled={completedModules.includes(activeModule.id)}
            >
              {completedModules.includes(activeModule.id)
                ? "Already Completed"
                : "Mark as Complete"}
            </Button>
          </div>
        </FullscreenView>
      )}
    </div>
  );
}
