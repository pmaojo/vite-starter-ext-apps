package com.example.mcpserver;
import io.modelcontextprotocol.server.McpServerFeatures;
public class TestFeatures {
    public static void main(String[] args) {
        System.out.println(McpServerFeatures.class.getMethods()[0].getName());
    }
}
