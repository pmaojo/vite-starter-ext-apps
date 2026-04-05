import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "host",
    position: { x: 50, y: 150 },
    data: { label: "MCP Host (AI Client)" },
    style: {
      backgroundColor: "#e2e8f0",
      color: "#1e293b",
      fontWeight: "bold",
      padding: "10px",
      borderRadius: "8px",
      border: "2px solid #94a3b8",
    },
  },
  {
    id: "app",
    position: { x: 300, y: 50 },
    data: { label: "MCP App (React UI)" },
    style: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      fontWeight: "bold",
      padding: "10px",
      borderRadius: "8px",
      border: "2px solid #93c5fd",
    },
  },
  {
    id: "server",
    position: { x: 300, y: 250 },
    data: { label: "MCP Server (Node.js)" },
    style: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      fontWeight: "bold",
      padding: "10px",
      borderRadius: "8px",
      border: "2px solid #86efac",
    },
  },
];

const initialEdges = [
  {
    id: "e-host-app",
    source: "host",
    target: "app",
    label: "Renders UI Resource",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-app-host",
    source: "app",
    target: "host",
    label: "SDK Handshake / sendMessage",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-host-server",
    source: "host",
    target: "server",
    label: "Tool Calls / SSE",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-app-server",
    source: "app",
    target: "server",
    label: "callServerTool",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeDasharray: "5 5" },
  },
];

export function DataFlowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#f8fafc",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
