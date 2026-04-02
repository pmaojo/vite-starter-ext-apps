import { buildApp } from "../main.js";
import { createServer } from "../server.js";

const app = buildApp(createServer);

export default app;
