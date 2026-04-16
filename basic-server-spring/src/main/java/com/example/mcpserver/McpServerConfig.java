package com.example.mcpserver;

import io.modelcontextprotocol.server.McpServer;
import io.modelcontextprotocol.server.McpServerFeatures;
import io.modelcontextprotocol.server.McpSyncServer;
import io.modelcontextprotocol.spec.McpSchema;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import io.modelcontextprotocol.spec.McpSchema.Tool;
import io.modelcontextprotocol.spec.ServerMcpTransport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;

@Configuration
public class McpServerConfig {

    private static final String RESOURCE_URI = "ui://get-time/mcp-app.html";

    // Convert to JSON String for the McpSchema.Tool constructor
    private String emptySchema() {
        return "{\"type\":\"object\",\"properties\":{}}";
    }

    private String listFilesSchema() {
        return "{" +
                "\"type\":\"object\"," +
                "\"properties\":{" +
                "\"subpath\":{" +
                "\"type\":\"string\"," +
                "\"description\":\"Optional subpath within the sandbox to list.\"" +
                "}" +
                "}" +
                "}";
    }

    private String handleListFiles(Map<String, Object> args) {
        try {
            Path sandboxDir = Paths.get(System.getProperty("user.dir")).getParent().resolve("mcp-sandbox").toAbsolutePath();
            // Since this runs in basic-server-spring, user.dir might be basic-server-spring.
            // Wait, let's use user.dir/mcp-sandbox if we run it from root, but to be safe let's check
            Path currentPath = Paths.get(System.getProperty("user.dir"));
            Path sandboxDirToUse = currentPath.resolve("mcp-sandbox").toAbsolutePath();
            if (!Files.exists(sandboxDirToUse)) {
                sandboxDirToUse = currentPath.getParent().resolve("mcp-sandbox").toAbsolutePath();
            }

            String subpath = args != null && args.containsKey("subpath") ? (String) args.get("subpath") : "";
            Path targetPath = sandboxDirToUse.resolve(subpath).normalize();

            if (!targetPath.startsWith(sandboxDirToUse)) {
                return "Security Error: Path traversal detected. Access denied.";
            }

            File targetFile = targetPath.toFile();
            if (!targetFile.exists() || !targetFile.isDirectory()) {
                return "Error: Target is not a directory.";
            }

            File[] files = targetFile.listFiles();
            if (files == null) {
                return "[]";
            }

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < files.length; i++) {
                File file = files[i];
                json.append("{")
                    .append("\"name\":\"").append(file.getName()).append("\",")
                    .append("\"isDirectory\":").append(file.isDirectory()).append(",")
                    .append("\"path\":\"").append(sandboxDirToUse.relativize(file.toPath()).toString().replace("\\", "/")).append("\"")
                    .append("}");
                if (i < files.length - 1) {
                    json.append(",");
                }
            }
            json.append("]");

            return json.toString();

        } catch (Exception e) {
            return "Error reading directory: " + e.getMessage();
        }
    }

    private String getHtmlContent() {
        try {
            // Try reading from classpath (resources/mcp-app.html)
            var resource = getClass().getResourceAsStream("/mcp-app.html");
            if (resource != null) {
                return new String(resource.readAllBytes());
            }
            // Fallback for development if file isn't in resources yet
            Path htmlPath = Paths.get(System.getProperty("user.dir")).getParent().resolve("dist").resolve("mcp-app.html");
            if (Files.exists(htmlPath)) {
                return Files.readString(htmlPath);
            }
            return "<html><body><h1>UI not found</h1></body></html>";
        } catch (Exception e) {
            return "<html><body><h1>Error loading UI: " + e.getMessage() + "</h1></body></html>";
        }
    }

    @Bean
    public McpSyncServer mcpServer(ServerMcpTransport transport) {

        // Define metadata
        // _meta: { ui: { resourceUri: ... } }
        /* Spring AI uses jackson so we can pass maps */
        Map<String, Object> meta = Map.of("ui", Map.of("resourceUri", RESOURCE_URI));

        Tool getTimeTool = new Tool("get-time", "Returns the current server time as an ISO 8601 string.", emptySchema());
        Tool hostBridgeTool = new Tool("host-bridge", "Demonstrates frontend SDK capabilities like sendMessage, sendLog, and openLink.", emptySchema());
        Tool listFilesTool = new Tool("list-files", "Lists files in the sandbox directory.", listFilesSchema());

        var server = McpServer.sync(transport)
                .serverInfo("Basic MCP App Server (Spring)", "1.0.0")
                .tools(
                    new McpServerFeatures.SyncToolRegistration(getTimeTool, request -> {
                        return new CallToolResult(List.of(new McpSchema.TextContent(Instant.now().toString())), false);
                    }),
                    new McpServerFeatures.SyncToolRegistration(hostBridgeTool, request -> {
                        return new CallToolResult(List.of(new McpSchema.TextContent("Host Bridge initialized. Please interact with the UI.")), false);
                    }),
                    new McpServerFeatures.SyncToolRegistration(listFilesTool, request -> {
                        String result = handleListFiles(request);
                        boolean isError = result.startsWith("Error") || result.startsWith("Security Error");
                        return new CallToolResult(List.of(new McpSchema.TextContent(result)), isError);
                    })
                )
                .resources(
                    new McpServerFeatures.SyncResourceRegistration(
                        new McpSchema.Resource(RESOURCE_URI, "Gets the UI", "text/html", RESOURCE_URI, null),
                        request -> {
                            String html = getHtmlContent();
                            McpSchema.TextResourceContents content = new McpSchema.TextResourceContents(RESOURCE_URI, "text/html", html);
                            return new McpSchema.ReadResourceResult(List.of(content));
                        }
                    )
                )
                .build();

        return server;
    }
}
