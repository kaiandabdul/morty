import type { Server as HTTPServer } from "node:http";
import type { Bun } from "bun";

export type EventType =
  | "session:start"
  | "session:end"
  | "task:start"
  | "task:complete"
  | "task:fail"
  | "step:update"
  | "file:read"
  | "file:write"
  | "command:run"
  | "tokens:update";

export interface DashboardEvent {
  id: string;
  type: EventType;
  timestamp: number;
  data: Record<string, unknown>;
}

// Store for WebSocket clients
const clients = new Set<WebSocket>();

// Event emitter singleton
let eventId = 0;

function generateEventId(): string {
  return `evt_${Date.now()}_${++eventId}`;
}

/**
 * Emit an event to all connected dashboard clients
 */
export function emitDashboardEvent(
  type: EventType,
  data: Record<string, unknown>,
): void {
  const event: DashboardEvent = {
    id: generateEventId(),
    type,
    timestamp: Date.now(),
    data,
  };

  const message = JSON.stringify(event);

  for (const client of clients) {
    try {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    } catch (error) {
      // Remove dead connections
      clients.delete(client);
    }
  }
}

/**
 * Start the dashboard WebSocket server using Bun
 */
export function startDashboardServer(port = 3847): { close: () => void } {
  const server = Bun.serve({
    port,
    fetch(req, server) {
      const url = new URL(req.url);

      // Handle WebSocket upgrade
      if (server.upgrade(req)) {
        return; // Upgraded to WebSocket
      }

      // Serve dashboard static files (for bundled dashboard)
      // For now, just return a simple status page
      if (url.pathname === "/" || url.pathname === "/status") {
        return new Response(
          JSON.stringify({
            status: "running",
            clients: clients.size,
            timestamp: Date.now(),
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response("Not Found", { status: 404 });
    },
    websocket: {
      open(ws) {
        clients.add(ws as unknown as WebSocket);
        console.log(`Dashboard client connected (${clients.size} total)`);
      },
      close(ws) {
        clients.delete(ws as unknown as WebSocket);
        console.log(
          `Dashboard client disconnected (${clients.size} remaining)`,
        );
      },
      message(ws, message) {
        // Handle incoming messages if needed
        // For now, dashboard is read-only
      },
    },
  });

  console.log(`Morty Dashboard server running on http://localhost:${port}`);

  return {
    close: () => {
      server.stop();
      clients.clear();
    },
  };
}

/**
 * Check if dashboard server should be started
 */
export function isDashboardEnabled(): boolean {
  return (
    process.env.MORTY_DASHBOARD === "true" ||
    process.argv.includes("--dashboard")
  );
}

// Export helper functions for common events
export const dashboard = {
  sessionStart: (engine: string, mode: string, workDir: string) =>
    emitDashboardEvent("session:start", {
      id: `session_${Date.now()}`,
      engine,
      mode,
      workDir,
    }),

  sessionEnd: () => emitDashboardEvent("session:end", {}),

  taskStart: (id: string, title: string) =>
    emitDashboardEvent("task:start", { id, title }),

  taskComplete: (id: string, title: string) =>
    emitDashboardEvent("task:complete", { id, title }),

  taskFail: (id: string, title: string, error: string) =>
    emitDashboardEvent("task:fail", { id, title, error }),

  stepUpdate: (step: string) => emitDashboardEvent("step:update", { step }),

  fileRead: (path: string) => emitDashboardEvent("file:read", { path }),

  fileWrite: (path: string) => emitDashboardEvent("file:write", { path }),

  commandRun: (command: string) =>
    emitDashboardEvent("command:run", { command }),

  tokensUpdate: (input: number, output: number, cost: number) =>
    emitDashboardEvent("tokens:update", { input, output, cost }),
};
