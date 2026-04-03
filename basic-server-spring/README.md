# Basic Server Example (Spring Boot)

An MCP App example with a React UI, powered by a Java Spring Boot backend using `spring-ai-mcp-server-spring-boot-starter`.

This directory provides the same capabilities as the `basic-server-react` example, but implemented in Java.

## Getting Started

### Prerequisites
- Java 17+
- Maven

### Build the Java Server

First, ensure the React UI is built in the root project:
```bash
# In the root project directory
npm install
npm run build:ui
cp dist/mcp-app.html basic-server-spring/src/main/resources/mcp-app.html
```

Then build the Spring Boot application:
```bash
cd basic-server-spring
mvn clean package
```

### Running the Server

You can run the application directly for testing:
```bash
mvn spring-boot:run
```
*Note: Because this MCP server uses STDIO transport, you will not see standard logs in the console to avoid corrupting the MCP stream. Application logs are written to `mcp-server-spring.log` in the root of `basic-server-spring`.*

## MCP Client Configuration

To configure your MCP Client to use this server, add the following to your configuration file, pointing to the built JAR file:

```json
{
  "mcpServers": {
    "basic-spring": {
      "command": "java",
      "args": [
        "-jar",
        "<absolute-path-to-repo>/basic-server-spring/target/basic-server-spring-0.0.1-SNAPSHOT.jar"
      ]
    }
  }
}
```
*(Replace `<absolute-path-to-repo>` with the actual path to your clone.)*

## Architecture

This project uses the official `@modelcontextprotocol/sdk` (via `spring-ai-mcp`) to expose:
1. `get-time` Tool: Returns the current server time
2. `host-bridge` Tool: Demonstrates frontend SDK capabilities
3. `list-files` Tool: Reads files in the `mcp-sandbox` directory
4. `ui://get-time/mcp-app.html` Resource: Serves the bundled React frontend
